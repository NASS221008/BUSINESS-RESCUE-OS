"""
Backend — Adithya
-------------------
The Orchestrator AI from the architecture diagram. A FastAPI server that:
  1. Exposes detected problems from the DB (Shubh's models)
  2. Runs the full agent pipeline (Nidhi's ai_ml/agents.py) on demand
  3. Stores the resulting Recovery Report with full agent assessments
  4. Exposes report retrieval so state persists seamlessly across reloads
  5. Lets a human approve the plan (per the PDF: AI never auto-executes)

Run:
    uvicorn backend.main:app --reload --port 8000
"""

import json
from dotenv import load_dotenv

# Load environment variables (.env) immediately
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database.db import init_db, SessionLocal
from database.models import Product, Problem, RecoveryReport
from ai_ml.agents import run_pipeline

app = FastAPI(title="Business Rescue OS", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


def format_report_dict(report: RecoveryReport, problem: Problem = None) -> dict:
    """Helper to convert a DB RecoveryReport into the full report dict."""
    if report.full_report_json:
        try:
            data = json.loads(report.full_report_json)
            data["approved"] = bool(report.approved)
            return data
        except Exception:
            pass

    prod_name = problem.product.name if problem and problem.product else "Unknown product"
    units_at_risk = problem.units_at_risk if problem else 0
    val_at_risk = problem.value_at_risk if problem else 0.0
    root_cause = problem.root_cause if problem else None

    # Calculate fallback metrics if needed
    exp_rec = report.expected_recovery or 0.0
    rem_risk = report.remaining_risk if report.remaining_risk is not None else max(0.0, val_at_risk - exp_rec)

    return {
        "problem": {
            "product": prod_name,
            "units_at_risk": units_at_risk,
            "value_at_risk": val_at_risk,
            "root_cause": root_cause,
        },
        "sales_assessment": {
            "sales_reason": "Historical assessment stored in database",
            "sell_through_estimate_pct": round((exp_rec / (val_at_risk or 1)) * 100, 1),
            "estimated_units_sold": round((exp_rec / (val_at_risk or 1)) * units_at_risk) if units_at_risk else 0
        },
        "inventory_assessment": {
            "inventory_issue": "At-risk stock requires redistribution or liquidation",
            "transfer_recommended": False,
            "transfer_candidate": "",
            "inventory_notes": "Archived recovery assessment"
        },
        "finance_assessment": {
            "risk_level": "Medium" if rem_risk < val_at_risk * 0.5 else "High",
            "expected_recovery": exp_rec,
            "remaining_risk": rem_risk,
            "finance_notes": f"Expected recovery of INR {exp_rec:,.0f} with residual risk of INR {rem_risk:,.0f}"
        },
        "external_options": json.loads(report.external_options_json or "[]"),
        "recommended_option": report.recommended_option or "Direct sales and external recovery",
        "recovery_plan": {
            "expected_recovery": exp_rec,
            "remaining_risk": rem_risk,
            "actions": json.loads(report.plan_json or "[]"),
        },
        "approved": bool(report.approved),
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Business Rescue OS Backend"}


@app.get("/api/problems")
def list_problems():
    db = SessionLocal()
    try:
        problems = db.query(Problem).all()
        results = []
        for p in problems:
            latest_report = (
                db.query(RecoveryReport)
                .filter(RecoveryReport.problem_id == p.id)
                .order_by(RecoveryReport.id.desc())
                .first()
            )
            report_dict = format_report_dict(latest_report, p) if latest_report else None

            results.append({
                "id": p.id,
                "product_id": p.product_id,
                "product_name": p.product.name if p.product else None,
                "problem_type": p.problem_type,
                "units_at_risk": p.units_at_risk,
                "value_at_risk": p.value_at_risk,
                "root_cause": p.root_cause,
                "status": p.status,
                "report": report_dict,
            })
        return results
    finally:
        db.close()


@app.get("/api/report/{problem_id}")
def get_report(problem_id: int):
    db = SessionLocal()
    try:
        problem = db.query(Problem).filter(Problem.id == problem_id).first()
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")

        report = (
            db.query(RecoveryReport)
            .filter(RecoveryReport.problem_id == problem_id)
            .order_by(RecoveryReport.id.desc())
            .first()
        )
        if not report:
            raise HTTPException(status_code=404, detail="No recovery report found for this problem")

        return format_report_dict(report, problem)
    finally:
        db.close()


@app.post("/api/analyze/{problem_id}")
def analyze(problem_id: int):
    """Runs Sales -> Inventory -> Finance -> Web Research -> Strategy agents."""
    db = SessionLocal()
    try:
        problem = db.query(Problem).filter(Problem.id == problem_id).first()
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")

        # 🔴 Runs multi-agent pipeline with live internet research
        report = run_pipeline(problem_id)

        # Persist report with full JSON payload
        db_report = RecoveryReport(
            problem_id=problem.id,
            external_options_json=json.dumps(report.get("external_options", [])),
            recommended_option=report.get("recommended_option", ""),
            expected_recovery=report.get("recovery_plan", {}).get("expected_recovery", 0.0),
            remaining_risk=report.get("recovery_plan", {}).get("remaining_risk", 0.0),
            plan_json=json.dumps(report.get("recovery_plan", {}).get("actions", [])),
            full_report_json=json.dumps(report, ensure_ascii=False),
            approved=0
        )
        problem.status = "analyzed"
        db.add(db_report)
        db.commit()

        report["approved"] = False
        return report
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@app.post("/api/approve/{problem_id}")
def approve(problem_id: int):
    """Human-in-the-loop approval — the AI never contacts suppliers itself."""
    db = SessionLocal()
    try:
        problem = db.query(Problem).filter(Problem.id == problem_id).first()
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")

        report = (
            db.query(RecoveryReport)
            .filter(RecoveryReport.problem_id == problem_id)
            .order_by(RecoveryReport.id.desc())
            .first()
        )
        if not report:
            raise HTTPException(status_code=400, detail="No recovery report to approve yet")

        report.approved = 1
        problem.status = "approved"
        db.commit()

        return {"status": "approved", "problem_id": problem_id}
    finally:
        db.close()

