"""
Business Rescue OS — Streamlit frontend (visually polished)

Same backend contract as before. This pass focuses purely on visual
identity: typography, a gradient hero header, custom stat cards,
category icons, risk-level badges, and a sidebar for filters so the
main area stays focused on the problem list.
"""

import streamlit as st
import requests

st.set_page_config(page_title="Business Rescue OS", page_icon="🚑", layout="wide")

BASE_URL = "http://localhost:8000"
REQUEST_TIMEOUT = 10
ANALYZE_TIMEOUT = 120
NOISY_DOMAINS = ["quora.com", "facebook.com", "linkedin.com", "reddit.com", "twitter.com", "x.com"]

PROBLEM_ICONS = {
    "overstock": "📦",
    "competitor_pricing": "💰",
    "seasonal_slowdown": "📉",
    "slow_moving": "🐢",
    "quality_defect": "⚠️",
    "seasonal_markdown": "🏷️",
    "expiry_risk": "⏳",
    "excess_inventory": "📦",
    "recall_risk": "🚨",
}

# ---------------------------------------------------------------------------
# Global styling
# ---------------------------------------------------------------------------

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    /* Hero banner */
    .brs-hero {
        background: linear-gradient(135deg, #F43F5E 0%, #BE123C 45%, #7F1D1D 100%);
        border-radius: 18px;
        padding: 32px 36px;
        margin-bottom: 28px;
        box-shadow: 0 8px 30px rgba(244, 63, 94, 0.25);
    }
    .brs-hero h1 {
        color: white;
        font-size: 2.1rem;
        font-weight: 800;
        margin: 0 0 6px 0;
    }
    .brs-hero p {
        color: #FFE4E6;
        font-size: 1rem;
        margin: 0;
    }

    /* Stat cards */
    .stat-card {
        background: #151E2E;
        border-radius: 14px;
        padding: 18px 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.25);
        height: 100%;
    }
    .stat-card .stat-icon { font-size: 1.4rem; margin-bottom: 6px; }
    .stat-card .stat-label { color: #9CA3AF; font-size: 0.82rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
    .stat-card .stat-value { color: #F9FAFB; font-size: 1.6rem; font-weight: 800; margin-top: 4px; }
    .stat-card-risk { border-top: 4px solid #F43F5E; }
    .stat-card-count { border-top: 4px solid #FBBF24; }
    .stat-card-approved { border-top: 4px solid #34D399; }
    .stat-card-recovery { border-top: 4px solid #38BDF8; }

    /* Problem cards */
    div[data-testid="stVerticalBlockBorderWrapper"] {
        border-radius: 14px !important;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    div[data-testid="stVerticalBlockBorderWrapper"]:hover {
        border-color: #F43F5E77;
        box-shadow: 0 4px 16px rgba(244, 63, 94, 0.12);
    }

    /* Badges */
    .brs-badge {
        display: inline-block;
        padding: 3px 11px;
        border-radius: 999px;
        font-size: 0.76rem;
        font-weight: 700;
        margin-right: 6px;
    }
    .brs-badge-detected { background: #7F1D1D55; color: #FCA5A5; }
    .brs-badge-analyzed { background: #78350F55; color: #FCD34D; }
    .brs-badge-approved { background: #14532D55; color: #86EFAC; }
    .brs-badge-risk-high { background: #F43F5E22; color: #F87171; }
    .brs-badge-risk-medium { background: #F59E0B22; color: #FBBF24; }
    .brs-badge-risk-low { background: #10B98122; color: #6EE7B7; }

    /* External option chips */
    .option-card {
        background: #101827;
        border: 1px solid #22304A;
        border-radius: 10px;
        padding: 12px 14px;
        margin-bottom: 10px;
        height: 100%;
    }
    .option-card .option-name { font-weight: 700; color: #F9FAFB; font-size: 0.92rem; }
    .option-card .option-reason { color: #9CA3AF; font-size: 0.82rem; margin-top: 4px; }
    .option-card a { color: #F87171; font-size: 0.82rem; font-weight: 600; }
    </style>
    """,
    unsafe_allow_html=True,
)

st.markdown(
    """
    <div class="brs-hero">
        <h1>🚑 Business Rescue OS</h1>
        <p>Detect at-risk inventory problems, draft an AI recovery plan, and approve it with a human in the loop.</p>
    </div>
    """,
    unsafe_allow_html=True,
)

# ---------------------------------------------------------------------------
# Session state
# ---------------------------------------------------------------------------

if "recovery_plans" not in st.session_state:
    st.session_state.recovery_plans = {}
if "approved" not in st.session_state:
    st.session_state.approved = {}
if "problems" not in st.session_state:
    st.session_state.problems = None
if "fetch_error" not in st.session_state:
    st.session_state.fetch_error = None
if "just_analyzed" not in st.session_state:
    st.session_state.just_analyzed = None


# ---------------------------------------------------------------------------
# Backend calls
# ---------------------------------------------------------------------------

def fetch_problems():
    try:
        resp = requests.get(f"{BASE_URL}/api/problems", timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        st.session_state.problems = resp.json()
        st.session_state.fetch_error = None
    except requests.exceptions.RequestException as e:
        st.session_state.problems = None
        st.session_state.fetch_error = str(e)


def analyze_problem(problem_id):
    try:
        resp = requests.post(f"{BASE_URL}/api/analyze/{problem_id}", timeout=ANALYZE_TIMEOUT)
        resp.raise_for_status()
        return resp.json(), None
    except requests.exceptions.RequestException as e:
        return None, str(e)


def approve_plan(problem_id):
    try:
        resp = requests.post(f"{BASE_URL}/api/approve/{problem_id}", timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return True, None
    except requests.exceptions.RequestException as e:
        return False, str(e)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def format_money(value):
    if isinstance(value, (int, float)):
        return f"₹{value:,.0f}"
    return value if value is not None else "—"


def humanize(text):
    if not text:
        return text
    if "_" in text and " " not in text:
        return text.replace("_", " ").strip().capitalize()
    return text


def is_noisy(url):
    if not url:
        return False
    return any(domain in url for domain in NOISY_DOMAINS)


def effective_status(problem):
    pid = problem.get("id")
    if st.session_state.approved.get(pid):
        return "approved"
    if pid in st.session_state.recovery_plans:
        return "analyzed"
    return problem.get("status", "detected")


def status_badge(status):
    labels = {"detected": "🔴 Detected", "analyzed": "🟡 Analyzed", "approved": "🟢 Approved"}
    css = {"detected": "brs-badge-detected", "analyzed": "brs-badge-analyzed", "approved": "brs-badge-approved"}
    return f'<span class="brs-badge {css.get(status, "brs-badge-detected")}">{labels.get(status, status)}</span>'


def risk_badge(value_at_risk, max_value):
    if not max_value:
        return ""
    ratio = (value_at_risk or 0) / max_value
    if ratio >= 0.66:
        return '<span class="brs-badge brs-badge-risk-high">🔥 High Risk</span>'
    elif ratio >= 0.33:
        return '<span class="brs-badge brs-badge-risk-medium">⚡ Medium Risk</span>'
    return '<span class="brs-badge brs-badge-risk-low">🟢 Low Risk</span>'


def stat_card(icon, label, value, css_class):
    return f"""
    <div class="stat-card {css_class}">
        <div class="stat-icon">{icon}</div>
        <div class="stat-label">{label}</div>
        <div class="stat-value">{value}</div>
    </div>
    """


# ---------------------------------------------------------------------------
# Sidebar — refresh + filters
# ---------------------------------------------------------------------------

with st.sidebar:
    st.markdown("### ⚙️ Controls")
    if st.button("🔄 Refresh problems", use_container_width=True):
        fetch_problems()

    st.markdown("---")
    st.markdown("### 🔍 Filter & Sort")
    search = st.text_input("Search by product name", "")
    status_filter = st.selectbox("Status", ["All", "Detected", "Analyzed", "Approved"])
    sort_option = st.selectbox("Sort by", ["Highest value at risk", "Lowest value at risk", "Product name (A-Z)"])

    st.markdown("---")
    st.caption("**Legend**")
    st.markdown(status_badge("detected") + " " + status_badge("analyzed") + " " + status_badge("approved"), unsafe_allow_html=True)
    st.markdown(risk_badge(100, 100) + " " + risk_badge(50, 100) + " " + risk_badge(10, 100), unsafe_allow_html=True)

# ---------------------------------------------------------------------------
# Load problems
# ---------------------------------------------------------------------------

if st.session_state.problems is None and st.session_state.fetch_error is None:
    fetch_problems()

if st.session_state.fetch_error is not None:
    st.error(f"⚠️ Could not reach the backend at `{BASE_URL}`.\n\nDetails: {st.session_state.fetch_error}")
    st.info("Make sure `uvicorn backend.main:app --reload --port 8000` is running, then click Refresh in the sidebar.")
    st.stop()

problems = st.session_state.problems or []

if len(problems) == 0:
    st.success("✅ No problems detected. Everything looks healthy right now.")
    st.stop()

max_value_at_risk = max((p.get("value_at_risk", 0) or 0) for p in problems)

# ---------------------------------------------------------------------------
# Dashboard KPIs
# ---------------------------------------------------------------------------

total_problems = len(problems)
total_value_at_risk = sum(p.get("value_at_risk", 0) or 0 for p in problems)
approved_count = sum(1 for p in problems if effective_status(p) == "approved")
total_expected_recovery = sum(
    (plan.get("recovery_plan", {}) or {}).get("expected_recovery", 0) or 0
    for plan in st.session_state.recovery_plans.values()
)

k1, k2, k3, k4 = st.columns(4)
with k1:
    st.markdown(stat_card("🚨", "Problems Detected", total_problems, "stat-card-count"), unsafe_allow_html=True)
with k2:
    st.markdown(stat_card("💸", "Total Value at Risk", format_money(total_value_at_risk), "stat-card-risk"), unsafe_allow_html=True)
with k3:
    st.markdown(stat_card("✅", "Plans Approved", f"{approved_count} / {total_problems}", "stat-card-approved"), unsafe_allow_html=True)
with k4:
    st.markdown(stat_card("📈", "Expected Recovery", format_money(total_expected_recovery), "stat-card-recovery"), unsafe_allow_html=True)

st.write("")

# Chart — sorted descending by value
try:
    import pandas as pd
    import altair as alt

    chart_df = (
        pd.DataFrame(problems)[["product_name", "value_at_risk"]]
        .sort_values("value_at_risk", ascending=False)
        .head(10)
    )
    with st.expander("📊 Value at risk by product (top 10)", expanded=False):
        chart = (
            alt.Chart(chart_df)
            .mark_bar(color="#F43F5E", cornerRadiusTopLeft=4, cornerRadiusTopRight=4)
            .encode(
                x=alt.X("product_name", sort=list(chart_df["product_name"]), title=None, axis=alt.Axis(labelAngle=-45)),
                y=alt.Y("value_at_risk", title="Value at Risk (₹)"),
                tooltip=["product_name", "value_at_risk"],
            )
            .properties(height=400)
        )
        st.altair_chart(chart, use_container_width=True)
except Exception:
    pass

st.markdown("---")

# ---------------------------------------------------------------------------
# Apply filters from sidebar
# ---------------------------------------------------------------------------

filtered = problems
if search:
    filtered = [p for p in filtered if search.lower() in (p.get("product_name") or "").lower()]
if status_filter != "All":
    filtered = [p for p in filtered if effective_status(p) == status_filter.lower()]

if sort_option == "Highest value at risk":
    filtered = sorted(filtered, key=lambda p: p.get("value_at_risk", 0) or 0, reverse=True)
elif sort_option == "Lowest value at risk":
    filtered = sorted(filtered, key=lambda p: p.get("value_at_risk", 0) or 0)
else:
    filtered = sorted(filtered, key=lambda p: (p.get("product_name") or "").lower())

st.subheader(f"📋 Detected Problems ({len(filtered)} shown of {total_problems})")

if len(filtered) == 0:
    st.info("No problems match your current filters.")

# ---------------------------------------------------------------------------
# Problem cards
# ---------------------------------------------------------------------------

for problem in filtered:
    pid = problem.get("id")
    product_name = problem.get("product_name", "Unknown product")
    problem_type = problem.get("problem_type", "")
    icon = PROBLEM_ICONS.get(problem_type, "📍")
    units_at_risk = problem.get("units_at_risk", "—")
    value_at_risk = problem.get("value_at_risk")
    status = effective_status(problem)

    with st.container(border=True):
        c1, c2, c3, c4 = st.columns([3, 2, 2, 2])
        with c1:
            st.markdown(f"### {icon} {product_name}")
            badges = status_badge(status) + " " + risk_badge(value_at_risk, max_value_at_risk)
            st.markdown(f"Problem ID: `{pid}` &nbsp; {badges}", unsafe_allow_html=True)
        with c2:
            st.metric("Units at risk", units_at_risk)
        with c3:
            st.metric("Value at risk", format_money(value_at_risk))
        with c4:
            st.write("")
            if st.button("Analyze", key=f"analyze_btn_{pid}", use_container_width=True):
                with st.spinner("Running AI recovery analysis — this can take up to a minute..."):
                    result, error = analyze_problem(pid)
                if error:
                    st.session_state.recovery_plans.pop(pid, None)
                    st.session_state[f"analyze_error_{pid}"] = error
                else:
                    st.session_state.recovery_plans[pid] = result
                    st.session_state.just_analyzed = pid
                    st.session_state.pop(f"analyze_error_{pid}", None)
                st.rerun()

        if st.session_state.get(f"analyze_error_{pid}"):
            st.error(f"Analysis failed: {st.session_state[f'analyze_error_{pid}']}")

        result = st.session_state.recovery_plans.get(pid)
        if result:
            with st.expander("🧭 Recovery Report", expanded=(st.session_state.just_analyzed == pid)):
                problem_detail = result.get("problem", {})
                recovery_plan = result.get("recovery_plan", {})

                root_cause = problem_detail.get("root_cause", "Not specified")
                st.markdown(f"**Root cause:** {root_cause}")

                m1, m2, m3 = st.columns(3)
                with m1:
                    st.metric("Value at Risk", format_money(problem_detail.get("value_at_risk", value_at_risk)))
                with m2:
                    st.metric("Expected Recovery", format_money(recovery_plan.get("expected_recovery")))
                with m3:
                    st.metric("Remaining Risk", format_money(recovery_plan.get("remaining_risk")))

                external_options = result.get("external_options", [])
                clean_options = [o for o in external_options if not is_noisy(o.get("source_url", ""))]
                if not clean_options:
                    clean_options = external_options
                clean_options = clean_options[:6]

                if clean_options:
                    st.markdown("**🔎 AI-researched external options** _(unverified leads from a live web search — not confirmed deals)_")
                    opt_cols = st.columns(2)
                    for i, opt in enumerate(clean_options):
                        name = opt.get("name", "Option")
                        reason = opt.get("reason", "")
                        url = opt.get("source_url")
                        short_reason = (reason[:110] + "…") if reason and len(reason) > 110 else reason
                        link_html = f'<a href="{url}" target="_blank">Visit →</a>' if url else ""
                        card_html = f"""
                        <div class="option-card">
                            <div class="option-name">{name}</div>
                            <div class="option-reason">{short_reason}</div>
                            {link_html}
                        </div>
                        """
                        with opt_cols[i % 2]:
                            st.markdown(card_html, unsafe_allow_html=True)
                else:
                    st.caption("No external options were found by the AI research step.")

                actions = recovery_plan.get("actions", [])
                recommended_option = result.get("recommended_option")

                if actions:
                    st.markdown("**📋 Proposed Actions**")
                    table_rows = [
                        {"Units": a.get("units", "—"), "Action": humanize(a.get("action", "—"))}
                        for a in actions
                    ]
                    st.table(table_rows)
                else:
                    st.caption("No specific actions were returned in the plan.")

                if recommended_option:
                    st.info(f"⭐ **Recommended approach:** {humanize(recommended_option)}")

                st.markdown("---")
                already_approved = st.session_state.approved.get(pid, False)

                if already_approved:
                    st.success(
                        "✅ **Plan approved** — no automatic action has been taken; "
                        "this is a human-approved recommendation only."
                    )
                else:
                    if st.button("✅ Approve Plan", key=f"approve_btn_{pid}", type="primary", use_container_width=True):
                        with st.spinner("Recording approval..."):
                            success, error = approve_plan(pid)
                        if success:
                            st.session_state.approved[pid] = True
                            st.rerun()
                        else:
                            st.error(f"Approval failed: {error}")
