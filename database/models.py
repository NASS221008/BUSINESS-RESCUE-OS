"""
Integration & Database — Shubh
--------------------------------
SQLAlchemy models. Field names here are load-bearing: backend/main.py
and ai_ml/agents.py read/write these exact attribute names
(p.product.name, problem.units_at_risk, report.approved = 1, etc.).
Don't rename anything without checking those two files.
"""

from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String)
    branch = Column(String)
    units_in_stock = Column(Integer, default=0)
    unit_price = Column(Float, default=0.0)

    problems = relationship("Problem", back_populates="product")


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    problem_type = Column(String)
    units_at_risk = Column(Integer)
    value_at_risk = Column(Float)
    root_cause = Column(String, nullable=True)
    status = Column(String, default="detected")  # detected -> analyzed -> approved

    product = relationship("Product", back_populates="problems")
    reports = relationship("RecoveryReport", back_populates="problem")


class RecoveryReport(Base):
    __tablename__ = "recovery_reports"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"))
    external_options_json = Column(Text)
    recommended_option = Column(String)
    expected_recovery = Column(Float)
    remaining_risk = Column(Float)
    plan_json = Column(Text)
    approved = Column(Integer, default=0)  # main.py sets this to 1 on approval

    problem = relationship("Problem", back_populates="reports")
