"""
Web Research Agent for Business Rescue OS.

Searches the live internet for real-world distributor, wholesale,
liquidation, and excess-inventory options.

Primary search engine:
    DuckDuckGo using the free ddgs package.

Optional upgrade:
    Tavily, only when TAVILY_API_KEY is available.

The system never requires a Tavily API key.

Returns:
    [
        {
            "name": "...",
            "reason": "...",
            "source_url": "..."
        }
    ]
"""

import os
from dotenv import load_dotenv

load_dotenv()



# --------------------------------------------------------------------------
# DuckDuckGo Search
# --------------------------------------------------------------------------

def _search_duckduckgo(query: str, max_results: int = 3):
    """
    Search DuckDuckGo using the free ddgs package.

    No API key is required.
    """

    results = []

    try:
        from ddgs import DDGS

        with DDGS() as ddgs:

            search_results = ddgs.text(
                query,
                max_results=max_results
            )

            for result in search_results:

                name = (
                    result.get("title")
                    or "Unknown source"
                ).strip()

                reason = (
                    result.get("body")
                    or ""
                ).strip()

                source_url = (
                    result.get("href")
                    or ""
                ).strip()

                if not source_url:
                    continue

                results.append({
                    "name": name,
                    "reason": reason[:220],
                    "source_url": source_url
                })

    except Exception as e:

        print(
            f"[Web Research Agent] "
            f"DuckDuckGo search failed for '{query}': {e}"
        )

    return results


# --------------------------------------------------------------------------
# Tavily Search
# --------------------------------------------------------------------------

def _search_tavily(query: str, max_results: int = 3):
    """
    Optional Tavily search.

    Returns:
        list  -> Tavily worked
        None  -> Tavily is unavailable or failed

    Returning None allows the caller to automatically fall back
    to DuckDuckGo.
    """

    api_key = os.environ.get("TAVILY_API_KEY")

    # Tavily is optional.
    if not api_key:
        return None

    try:

        from tavily import TavilyClient

        client = TavilyClient(
            api_key=api_key
        )

        response = client.search(
            query=query,
            max_results=max_results
        )

        results = []

        for result in response.get("results", []):

            name = (
                result.get("title")
                or "Unknown source"
            ).strip()

            reason = (
                result.get("content")
                or ""
            ).strip()

            source_url = (
                result.get("url")
                or ""
            ).strip()

            if not source_url:
                continue

            results.append({
                "name": name,
                "reason": reason[:220],
                "source_url": source_url
            })

        return results

    except Exception as e:

        print(
            f"[Web Research Agent] "
            f"Tavily search failed for '{query}': {e}"
        )

        # Tell the caller to use DuckDuckGo.
        return None


# --------------------------------------------------------------------------
# De-duplication
# --------------------------------------------------------------------------

def _dedupe(options):
    """
    Remove duplicate search results.

    URL is preferred as the unique identifier.
    If URL is unavailable, the result name is used.
    """

    seen = set()
    deduped = []

    for option in options:

        source_url = (
            option.get("source_url")
            or ""
        ).strip()

        name = (
            option.get("name")
            or ""
        ).strip()

        key = source_url.lower() or name.lower()

        if not key:
            continue

        if key in seen:
            continue

        seen.add(key)

        deduped.append({
            "name": name or "Unknown source",
            "reason": (
                option.get("reason")
                or ""
            ).strip()[:220],
            "source_url": source_url
        })

    return deduped


# --------------------------------------------------------------------------
# Main Web Research Function
# --------------------------------------------------------------------------

def search_external_options(
    product_name: str,
    root_cause: str,
    limit: int = 5
):
    """
    Search for real-world external recovery options.

    Inputs:
        product_name:
            Product or product category.

        root_cause:
            Reason why the inventory is at risk.

        limit:
            Maximum number of results returned.

    Returns:
        A list of up to 5 dictionaries:

        {
            "name": "...",
            "reason": "...",
            "source_url": "..."
        }
    """

    # Never allow the dashboard to become too large.
    limit = max(
        3,
        min(int(limit), 5)
    )

    # ----------------------------------------------------------------------
    # Targeted searches with clean terms
    # ----------------------------------------------------------------------

    # Extract short keywords from root_cause (first 5 words)
    clean_cause = " ".join((root_cause or "").split()[:5])

    queries = [
        f"wholesale distributor India {product_name}",
        f"bulk liquidation buyers India {product_name}",
    ]
    if clean_cause:
        queries.append(f"excess inventory buyers India {product_name} {clean_cause}")
    else:
        queries.append(f"excess inventory liquidation India {product_name}")

    all_results = []

    # ----------------------------------------------------------------------
    # Search each query
    # ----------------------------------------------------------------------

    for query in queries:

        # --------------------------------------------------------------
        # Try Tavily first if TAVILY_API_KEY exists.
        # --------------------------------------------------------------

        tavily_results = _search_tavily(
            query,
            max_results=3
        )

        if tavily_results is not None:

            all_results.extend(
                tavily_results
            )

        else:

            # ----------------------------------------------------------
            # No Tavily key OR Tavily failed:
            # automatically use free DuckDuckGo.
            # ----------------------------------------------------------

            duckduckgo_results = _search_duckduckgo(
                query,
                max_results=3
            )

            all_results.extend(
                duckduckgo_results
            )

    # Fallback options if web search is sparse or offline
    curated_fallbacks = [
        {
            "name": "Excess2sell B2B Liquidation Marketplace",
            "reason": f"Tech-enabled B2B marketplace for liquidation of excess/overstock {product_name} inventory in India.",
            "source_url": "https://www.excess2sell.com/"
        },
        {
            "name": "Racklots Surplus Inventory Exchange",
            "reason": f"Direct B2B buyers for bulk excess inventory and liquidation lots across Indian commercial hubs.",
            "source_url": "https://www.racklots.com/"
        },
        {
            "name": "IndiaMART Wholesale & Liquidation Directory",
            "reason": f"Verified wholesale suppliers and bulk stock clearance buyers for {product_name} in India.",
            "source_url": "https://www.indiamart.com/"
        }
    ]

    # If live search returned few results, supplement with curated B2B leads
    if len(all_results) < 2:
        all_results.extend(curated_fallbacks)

    # ----------------------------------------------------------------------
    # Clean and de-duplicate
    # ----------------------------------------------------------------------

    deduped_results = _dedupe(
        all_results
    )

    # ----------------------------------------------------------------------
    # Keep dashboard readable
    # ----------------------------------------------------------------------

    return deduped_results[:limit]



# --------------------------------------------------------------------------
# Manual Smoke Test
# --------------------------------------------------------------------------

if __name__ == "__main__":

    import json

    print(
        "[Web Research Agent] Starting smoke test..."
    )

    options = search_external_options(
        product_name="Product X",
        root_cause="Declining demand + excess inventory"
    )

    print(
        json.dumps(
            options,
            indent=2,
            ensure_ascii=False
        )
    )