"""
Backend Server — Business Rescue OS
Enterprise Supply Chain & Working Capital Recovery Orchestrator
"""

import json
import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from database.db import init_db, SessionLocal
from database.models import Product, Problem, RecoveryReport
from database.seed_data import seed
from ai_ml.agents import run_pipeline
from backend.auth import get_current_user_id

app = FastAPI(title="Business Rescue OS — Enterprise Supply Chain Intelligence")

# Allow any frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StockIncidentInput(BaseModel):
    product_name: str
    category: str = "General Merchandise"
    branch: str = "Central Warehouse"
    units_in_stock: int = 100
    units_at_risk: int = 50
    unit_price: float = 1000.0
    problem_type: str = "Excess Inventory"
    root_cause: str = "Market shift and demand variance."


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/problems")
def list_problems(user_id: str = Depends(get_current_user_id)):
    db = SessionLocal()
    try:
        problems = (
            db.query(Problem)
            .join(Product)
            .filter(Product.owner_id == user_id)
            .all()
        )
        results = []
        for p in problems:
            latest_report = (
                db.query(RecoveryReport)
                .filter(RecoveryReport.problem_id == p.id)
                .order_by(RecoveryReport.id.desc())
                .first()
            )
            # Format clean human-readable category and type
            category_clean = (p.product.category or "General Merchandise").replace("_", " ") if p.product else "General Merchandise"
            problem_type_clean = (p.problem_type or "Excess Inventory").replace("_", " ")

            results.append({
                "id": p.id,
                "product_id": p.product_id,
                "product_name": p.product.name if p.product else "Unassigned Item",
                "category": category_clean,
                "branch": p.product.branch if p.product else "Central Hub",
                "units_in_stock": p.product.units_in_stock if p.product else 0,
                "unit_price": p.product.unit_price if p.product else 0.0,
                "problem_type": problem_type_clean,
                "units_at_risk": p.units_at_risk,
                "value_at_risk": p.value_at_risk,
                "root_cause": p.root_cause,
                "status": p.status,
                "has_report": latest_report is not None,
                "approved": bool(latest_report.approved) if latest_report else False,
                "expected_recovery": latest_report.expected_recovery if latest_report else None,
            })
        return results
    finally:
        db.close()


@app.post("/api/problems")
def create_problem(req: StockIncidentInput, user_id: str = Depends(get_current_user_id)):
    """Register a new user-defined company stock incident into the inventory ledger."""
    db = SessionLocal()
    try:
        # 1. Create Product
        product = Product(
            owner_id=user_id,
            name=req.product_name.strip(),
            category=req.category.replace("_", " ").strip(),
            branch=req.branch.strip(),
            units_in_stock=max(req.units_in_stock, req.units_at_risk),
            unit_price=float(req.unit_price),
        )
        db.add(product)
        db.commit()
        db.refresh(product)

        # 2. Create Incident Record
        total_risk = float(req.units_at_risk) * float(req.unit_price)
        problem = Problem(
            product_id=product.id,
            problem_type=req.problem_type.replace("_", " ").strip(),
            units_at_risk=int(req.units_at_risk),
            value_at_risk=total_risk,
            root_cause=req.root_cause.strip(),
            status="detected",
        )
        db.add(problem)
        db.commit()
        db.refresh(problem)

        return {
            "id": problem.id,
            "product_id": product.id,
            "product_name": product.name,
            "category": product.category,
            "branch": product.branch,
            "units_in_stock": product.units_in_stock,
            "unit_price": product.unit_price,
            "problem_type": problem.problem_type,
            "units_at_risk": problem.units_at_risk,
            "value_at_risk": problem.value_at_risk,
            "root_cause": problem.root_cause,
            "status": problem.status,
            "has_report": False,
            "approved": False,
            "expected_recovery": None,
        }
    finally:
        db.close()


@app.put("/api/problems/{problem_id}")
def update_problem(problem_id: int, req: StockIncidentInput, user_id: str = Depends(get_current_user_id)):
    """Edit an existing stock incident's details (owner-scoped)."""
    db = SessionLocal()
    try:
        problem = (
            db.query(Problem)
            .join(Product)
            .filter(Problem.id == problem_id, Product.owner_id == user_id)
            .first()
        )
        if not problem:
            raise HTTPException(status_code=404, detail="Incident not found")

        product = db.query(Product).filter(Product.id == problem.product_id).first()

        product.name = req.product_name.strip()
        product.category = req.category.replace("_", " ").strip()
        product.branch = req.branch.strip()
        product.units_in_stock = max(req.units_in_stock, req.units_at_risk)
        product.unit_price = float(req.unit_price)

        problem.problem_type = req.problem_type.replace("_", " ").strip()
        problem.units_at_risk = int(req.units_at_risk)
        problem.value_at_risk = float(req.units_at_risk) * float(req.unit_price)
        problem.root_cause = req.root_cause.strip()
        # Any prior analysis/report is now based on stale numbers — clear it so the
        # user is prompted to re-run "Analyze" against the updated details.
        problem.status = "detected"
        db.query(RecoveryReport).filter(RecoveryReport.problem_id == problem_id).delete()

        db.commit()
        db.refresh(problem)
        db.refresh(product)

        return {
            "id": problem.id,
            "product_id": product.id,
            "product_name": product.name,
            "category": product.category,
            "branch": product.branch,
            "units_in_stock": product.units_in_stock,
            "unit_price": product.unit_price,
            "problem_type": problem.problem_type,
            "units_at_risk": problem.units_at_risk,
            "value_at_risk": problem.value_at_risk,
            "root_cause": problem.root_cause,
            "status": problem.status,
            "has_report": False,
            "approved": False,
            "expected_recovery": None,
        }
    finally:
        db.close()


@app.delete("/api/problems/{problem_id}")
def delete_problem(problem_id: int, user_id: str = Depends(get_current_user_id)):
    """Delete a stock incident from the database."""
    db = SessionLocal()
    try:
        problem = (
            db.query(Problem)
            .join(Product)
            .filter(Problem.id == problem_id, Product.owner_id == user_id)
            .first()
        )
        if not problem:
            raise HTTPException(status_code=404, detail="Incident not found")

        # Delete any associated recovery reports first
        db.query(RecoveryReport).filter(RecoveryReport.problem_id == problem_id).delete()

        # Delete problem
        db.delete(problem)
        db.commit()

        return {"status": "success", "message": f"Stock incident #{problem_id} deleted successfully."}
    finally:
        db.close()


@app.get("/api/reports/{problem_id}")
def get_report(problem_id: int, user_id: str = Depends(get_current_user_id)):
    """Retrieve the latest recovery strategy report for an incident."""
    db = SessionLocal()
    try:
        problem = (
            db.query(Problem)
            .join(Product)
            .filter(Problem.id == problem_id, Product.owner_id == user_id)
            .first()
        )
        if not problem:
            raise HTTPException(status_code=404, detail="Incident not found")

        report = (
            db.query(RecoveryReport)
            .filter(RecoveryReport.problem_id == problem_id)
            .order_by(RecoveryReport.id.desc())
            .first()
        )
        if not report:
            raise HTTPException(status_code=404, detail="Recovery report not found for this incident")

        product = problem.product
        return {
            "problem": {
                "id": problem.id,
                "product": product.name if product else "Unknown Item",
                "category": (product.category or "").replace("_", " ") if product else "",
                "branch": product.branch if product else "",
                "units_at_risk": problem.units_at_risk,
                "value_at_risk": problem.value_at_risk,
                "root_cause": problem.root_cause,
                "status": problem.status,
            },
            "external_options": json.loads(report.external_options_json) if report.external_options_json else [],
            "recommended_option": report.recommended_option,
            "recovery_plan": {
                "expected_recovery": report.expected_recovery,
                "remaining_risk": report.remaining_risk,
                "actions": json.loads(report.plan_json) if report.plan_json else [],
            },
            "approved": bool(report.approved),
        }
    finally:
        db.close()


@app.get("/api/stats")
def get_stats(user_id: str = Depends(get_current_user_id)):
    """Aggregate executive dashboard metrics."""
    db = SessionLocal()
    try:
        problems = db.query(Problem).join(Product).filter(Product.owner_id == user_id).all()
        problem_ids = [p.id for p in problems]
        reports = (
            db.query(RecoveryReport).filter(RecoveryReport.problem_id.in_(problem_ids)).all()
            if problem_ids
            else []
        )

        total_problems = len(problems)
        total_value_at_risk = sum((p.value_at_risk or 0) for p in problems)

        latest_reports = {}
        for r in reports:
            if r.problem_id not in latest_reports or r.id > latest_reports[r.problem_id].id:
                latest_reports[r.problem_id] = r

        total_expected_recovery = sum(r.expected_recovery or 0 for r in latest_reports.values())
        total_remaining_risk = sum(r.remaining_risk or 0 for r in latest_reports.values())
        approved_count = sum(1 for r in latest_reports.values() if r.approved)
        analyzed_count = sum(1 for p in problems if p.status in ["analyzed", "approved"])

        categories = {}
        branches = {}
        for p in problems:
            cat = ((p.product.category if p.product else None) or "General Merchandise").replace("_", " ")
            br = (p.product.branch if p.product else None) or "Central Hub"
            categories[cat] = categories.get(cat, 0) + 1
            branches[br] = branches.get(br, 0) + (p.value_at_risk or 0)

        return {
            "total_problems": total_problems,
            "total_value_at_risk": total_value_at_risk,
            "total_expected_recovery": total_expected_recovery,
            "total_remaining_risk": total_remaining_risk,
            "approved_count": approved_count,
            "analyzed_count": analyzed_count,
            "categories": categories,
            "branches": branches,
        }
    finally:
        db.close()


@app.post("/api/analyze/{problem_id}")
def analyze(problem_id: int, user_id: str = Depends(get_current_user_id)):
    """Runs the full optimization analysis pipeline."""
    db = SessionLocal()
    try:
        problem = (
            db.query(Problem)
            .join(Product)
            .filter(Problem.id == problem_id, Product.owner_id == user_id)
            .first()
        )
        if not problem:
            raise HTTPException(status_code=404, detail="Incident not found")

        report = run_pipeline(problem_id)

        db_report = RecoveryReport(
            problem_id=problem.id,
            external_options_json=json.dumps(report.get("external_options", [])),
            recommended_option=report.get("recommended_option", "Combined Recovery Plan"),
            expected_recovery=report["recovery_plan"]["expected_recovery"],
            remaining_risk=report["recovery_plan"]["remaining_risk"],
            plan_json=json.dumps(report["recovery_plan"]["actions"]),
        )
        problem.status = "analyzed"
        db.add(db_report)
        db.commit()

        return report
    finally:
        db.close()


@app.post("/api/approve/{problem_id}")
def approve(problem_id: int, user_id: str = Depends(get_current_user_id)):
    """Executive Human-in-the-Loop authorization."""
    db = SessionLocal()
    try:
        problem = (
            db.query(Problem)
            .join(Product)
            .filter(Problem.id == problem_id, Product.owner_id == user_id)
            .first()
        )
        if not problem:
            raise HTTPException(status_code=404, detail="Incident not found")

        report = (
            db.query(RecoveryReport)
            .filter(RecoveryReport.problem_id == problem_id)
            .order_by(RecoveryReport.id.desc())
            .first()
        )
        if not report:
            raise HTTPException(status_code=400, detail="No recovery report to authorize yet")

        report.approved = 1
        problem.status = "approved"
        db.commit()

        return {"status": "approved", "problem_id": problem_id, "message": "Plan successfully authorized by Executive Operator."}
    finally:
        db.close()


@app.post("/api/reset")
def reset_database(user_id: str = Depends(get_current_user_id)):
    """Wipe only the calling user's own incidents (never touches other accounts)."""
    db = SessionLocal()
    try:
        my_products = db.query(Product).filter(Product.owner_id == user_id).all()
        my_product_ids = [p.id for p in my_products]
        my_problems = (
            db.query(Problem).filter(Problem.product_id.in_(my_product_ids)).all()
            if my_product_ids
            else []
        )
        my_problem_ids = [p.id for p in my_problems]

        if my_problem_ids:
            db.query(RecoveryReport).filter(RecoveryReport.problem_id.in_(my_problem_ids)).delete(
                synchronize_session=False
            )
            db.query(Problem).filter(Problem.id.in_(my_problem_ids)).delete(synchronize_session=False)
        if my_product_ids:
            db.query(Product).filter(Product.id.in_(my_product_ids)).delete(synchronize_session=False)

        db.commit()
        return {"status": "success", "message": "Your workspace has been reset."}
    finally:
        db.close()


# Mount Static Production Build if exists
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist_dir = os.path.join(base_dir, "frontend-ui", "dist")

if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_candidate = os.path.join(dist_dir, full_path)
        if os.path.isfile(file_candidate):
            return FileResponse(file_candidate)
        return FileResponse(os.path.join(dist_dir, "index.html"))
