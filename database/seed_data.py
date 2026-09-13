"""
Database Seeding for Business Rescue OS
"""

from database.db import init_db, SessionLocal
from database.models import Product, Problem, RecoveryReport


def seed(only_sample: bool = True):
    init_db()
    db = SessionLocal()

    # Clear existing
    db.query(RecoveryReport).delete()
    db.query(Problem).delete()
    db.query(Product).delete()
    db.commit()

    sample_entries = [
        dict(
            product=dict(
                name="Sony WH-1000XM4 Wireless Headphones", 
                branch="Bengaluru",
                units_in_stock=150, 
                unit_price=24990.0, 
                category="Consumer Electronics"
            ),
            problem=dict(
                problem_type="Excess Inventory", 
                units_at_risk=60, 
                value_at_risk=1499400.0,
                root_cause="Launch of the successor WH-1000XM5 model shifted consumer demand away from this SKU.",
                status="detected"
            ),
        ),
        dict(
            product=dict(
                name="Amul Butter 500g", 
                branch="Ahmedabad",
                units_in_stock=5000, 
                unit_price=265.0, 
                category="Grocery & FMCG"
            ),
            problem=dict(
                problem_type="Expiration Window Risk", 
                units_at_risk=1200, 
                value_at_risk=318000.0,
                root_cause="Distribution center over-ordered prior to a festival that experienced lower commercial footfall than projected.",
                status="detected"
            ),
        ),
    ]

    for entry in sample_entries:
        product = Product(**entry["product"])
        db.add(product)
        db.commit()
        db.refresh(product)

        problem = Problem(product_id=product.id, **entry["problem"])
        db.add(problem)
        db.commit()

    print(f"Successfully seeded {len(sample_entries)} initial sample stock scenarios.")
    db.close()


if __name__ == "__main__":
    seed(only_sample=True)
