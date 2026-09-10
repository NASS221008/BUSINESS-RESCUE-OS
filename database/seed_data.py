"""
Integration & Database — Shubh
--------------------------------
Run this once to create the DB and load 20 realistic inventory
problems across real, recognizable retail products (not placeholders),
spanning electronics, apparel, footwear, FMCG/grocery, appliances,
beauty, fitness, and furniture — so the demo shows the app handling
a genuinely varied set of real-world cases.

Run:  python -m database.seed_data
"""

from database.db import init_db, SessionLocal
from database.models import Product, Problem


def seed():
    init_db()
    db = SessionLocal()

    if db.query(Product).first():
        print("DB already seeded.")
        return

    # Each entry: product details + the at-risk problem tied to it.
    # value_at_risk = units_at_risk * unit_price (kept consistent).
    entries = [
        dict(
            product=dict(name="Sony WH-1000XM4 Wireless Headphones", branch="Bengaluru",
                         units_in_stock=150, unit_price=24990.0, category="electronics"),
            problem=dict(problem_type="overstock", units_at_risk=60, value_at_risk=1499400.0,
                         root_cause="Launch of the WH-1000XM5 shifted customer demand away from this SKU.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Samsung Galaxy Buds2", branch="Mumbai",
                         units_in_stock=300, unit_price=9999.0, category="electronics"),
            problem=dict(problem_type="competitor_pricing", units_at_risk=120, value_at_risk=1199880.0,
                         root_cause="A competitor is bundling free earbuds with phone purchases, undercutting standalone sales.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Nike Air Zoom Pegasus 40", branch="Chennai",
                         units_in_stock=200, unit_price=11995.0, category="footwear"),
            problem=dict(problem_type="seasonal_slowdown", units_at_risk=85, value_at_risk=1019575.0,
                         root_cause="Inventory was built up ahead of a community marathon that was later cancelled.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Adidas Ultraboost 22", branch="Delhi",
                         units_in_stock=180, unit_price=15999.0, category="footwear"),
            problem=dict(problem_type="overstock", units_at_risk=70, value_at_risk=1119930.0,
                         root_cause="Release of the Ultraboost 23 successor model is cannibalizing sales of this SKU.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Prestige Induction Cooktop PIC 3.1", branch="Pune",
                         units_in_stock=400, unit_price=2499.0, category="home_appliances"),
            problem=dict(problem_type="slow_moving", units_at_risk=150, value_at_risk=374850.0,
                         root_cause="Regional power-cut schedules reduced customer interest in induction cooktops this quarter.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Philips Air Fryer HD9252", branch="Hyderabad",
                         units_in_stock=90, unit_price=8995.0, category="home_appliances"),
            problem=dict(problem_type="quality_defect", units_at_risk=35, value_at_risk=314825.0,
                         root_cause="A batch was flagged after several units were returned for a faulty heating element.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Fabindia Men's Cotton Kurta", branch="Jaipur",
                         units_in_stock=500, unit_price=1799.0, category="apparel"),
            problem=dict(problem_type="seasonal_markdown", units_at_risk=220, value_at_risk=395780.0,
                         root_cause="End-of-season summer stock with the wedding-season demand window already passed.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Levi's 511 Slim Fit Jeans", branch="Mumbai",
                         units_in_stock=350, unit_price=3499.0, category="apparel"),
            problem=dict(problem_type="overstock", units_at_risk=140, value_at_risk=489860.0,
                         root_cause="Bulk order was placed ahead of a promotional campaign that was later cancelled.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Amul Butter 500g", branch="Ahmedabad",
                         units_in_stock=5000, unit_price=265.0, category="grocery_fmcg"),
            problem=dict(problem_type="expiry_risk", units_at_risk=1200, value_at_risk=318000.0,
                         root_cause="Distribution center over-ordered ahead of a festival that saw lower footfall than forecast.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Nescafe Classic Instant Coffee 200g", branch="Kolkata",
                         units_in_stock=3000, unit_price=449.0, category="grocery_fmcg"),
            problem=dict(problem_type="expiry_risk", units_at_risk=800, value_at_risk=359200.0,
                         root_cause="Retail sell-through has been slower than forecast; stock is approaching its shelf-life window.",
                         status="detected"),
        ),
        dict(
            product=dict(name="boAt Rockerz 450 Bluetooth Headphones", branch="Chennai",
                         units_in_stock=600, unit_price=1499.0, category="electronics"),
            problem=dict(problem_type="overstock", units_at_risk=250, value_at_risk=374750.0,
                         root_cause="A flash sale on a competing e-commerce platform diverted customers away from in-store stock.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Milton Thermosteel Flask 1L", branch="Pune",
                         units_in_stock=700, unit_price=899.0, category="home_kitchen"),
            problem=dict(problem_type="slow_moving", units_at_risk=300, value_at_risk=269700.0,
                         root_cause="Overordered for a corporate gifting season that underperformed expectations.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Cadbury Dairy Milk Silk Festive Pack", branch="Delhi",
                         units_in_stock=2000, unit_price=499.0, category="grocery_fmcg"),
            problem=dict(problem_type="seasonal_markdown", units_at_risk=900, value_at_risk=449100.0,
                         root_cause="Diwali festive packaging is losing relevance now that the festival has passed.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Decathlon Quechua Yoga Mat", branch="Bengaluru",
                         units_in_stock=450, unit_price=999.0, category="fitness"),
            problem=dict(problem_type="slow_moving", units_at_risk=180, value_at_risk=179820.0,
                         root_cause="New Year fitness-resolution demand has tapered off earlier than usual this year.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Lakme Absolute Matte Lipstick", branch="Mumbai",
                         units_in_stock=800, unit_price=550.0, category="beauty"),
            problem=dict(problem_type="slow_moving", units_at_risk=320, value_at_risk=176000.0,
                         root_cause="The shade has been discontinued by the brand, and remaining stock has limited marketing support.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Whirlpool 190L Single Door Refrigerator", branch="Hyderabad",
                         units_in_stock=60, unit_price=16990.0, category="home_appliances"),
            problem=dict(problem_type="overstock", units_at_risk=25, value_at_risk=424750.0,
                         root_cause="A model-year transition means customers now prefer the newer, better energy-rated model.",
                         status="detected"),
        ),
        dict(
            product=dict(name="HP DeskJet 2331 All-in-One Printer", branch="Pune",
                         units_in_stock=120, unit_price=3199.0, category="electronics"),
            problem=dict(problem_type="slow_moving", units_at_risk=55, value_at_risk=175945.0,
                         root_cause="A shift back to office work has reduced home-printer demand post-pandemic.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Bata Men's Formal Leather Shoes", branch="Chennai",
                         units_in_stock=300, unit_price=1899.0, category="footwear"),
            problem=dict(problem_type="seasonal_markdown", units_at_risk=130, value_at_risk=246870.0,
                         root_cause="Wedding and interview season demand has passed, and remaining sizes skew toward less popular ranges.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Godrej Interio Study Table", branch="Delhi",
                         units_in_stock=80, unit_price=5999.0, category="furniture"),
            problem=dict(problem_type="slow_moving", units_at_risk=30, value_at_risk=179970.0,
                         root_cause="The back-to-school demand window has closed, and remaining stock is in a less popular finish.",
                         status="detected"),
        ),
        dict(
            product=dict(name="Patanjali Aloe Vera Gel 200ml", branch="Lucknow",
                         units_in_stock=4000, unit_price=99.0, category="personal_care"),
            problem=dict(problem_type="expiry_risk", units_at_risk=1500, value_at_risk=148500.0,
                         root_cause="Overstocked ahead of the summer skincare season; stock is approaching expiry within 4 months.",
                         status="detected"),
        ),
    ]

    for entry in entries:
        product = Product(**entry["product"])
        db.add(product)
        db.commit()
        db.refresh(product)

        problem = Problem(product_id=product.id, **entry["problem"])
        db.add(problem)
        db.commit()

        print(f"Seeded product id={product.id} ({product.name}), problem id={problem.id}")

    db.close()


if __name__ == "__main__":
    seed()
