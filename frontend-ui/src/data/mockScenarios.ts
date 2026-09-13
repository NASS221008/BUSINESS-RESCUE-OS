import { RecoveryReportData } from '../types/data';

export const PRESET_REPORTS: Record<number, RecoveryReportData> = {
  1: {
    problem: {
      id: 1,
      product: "Sony WH-1000XM4 Wireless Headphones",
      category: "electronics",
      branch: "Bengaluru",
      units_at_risk: 60,
      value_at_risk: 1499400,
      root_cause: "Launch of the WH-1000XM5 shifted customer demand away from this SKU.",
      status: "analyzed"
    },
    sales_assessment: {
      sell_through_estimate_pct: 45,
      estimated_units_sold: 27,
      sales_reason: "Premium noise-cancelling headphones retain strong secondary market appeal among students and software developers in tech corridors like Bengaluru if offered with an bundled audio cable or targeted 12% markdown."
    },
    inventory_assessment: {
      inventory_issue: "Overstocked flagship audio SKU cannibalized by newer generation release.",
      transfer_recommended: true,
      transfer_candidate: "Pune & Hyderabad IT Hub branches where XM4 demand remains 34% higher.",
      inventory_notes: "Bengaluru branch has 90 days of inventory cover. Immediate inter-branch rebalancing recommended to avoid obsolescence."
    },
    finance_assessment: {
      risk_level: "High",
      expected_recovery: 1245000,
      remaining_risk: 254400,
      finance_notes: "Recovering 83% of locked working capital (₹12.45L out of ₹14.99L) by combining multi-branch transfer with verified B2B corporate gift distributor purchase."
    },
    external_options: [
      {
        name: "Croma Enterprise Corporate Gifting Division",
        reason: "Active demand for premium branded audio peripherals for Q3 employee milestone gifting packages.",
        source_url: "https://www.croma.com/corporate-gifting",
        tag: "Verified B2B Buyer"
      },
      {
        name: "SurplusTech India Liquidation Network",
        reason: "Accepts brand-new sealed consumer electronics with 70-80% invoice recovery rate within 48 hours.",
        source_url: "https://www.surplustech.in",
        tag: "Liquidator"
      },
      {
        name: "Vijay Sales Institutional Bulk Procurement",
        reason: "Off-price retail placement for previous-gen flagship electronics with immediate settlement.",
        source_url: "https://www.vijaysales.com",
        tag: "Wholesale Partner"
      }
    ],
    recommended_option: "Multi-Branch Redistribution + Corporate Bulk Gifting Package",
    recovery_plan: {
      expected_recovery: 1245000,
      remaining_risk: 254400,
      actions: [
        {
          units: 25,
          action: "Inter-branch transfer to Pune & Hyderabad IT Corridor retail outlets (Zero margin loss)",
          type: "transfer"
        },
        {
          units: 20,
          action: "Direct supply to Corporate Gifting partner at 10% volume discount",
          type: "distributor"
        },
        {
          units: 15,
          action: "In-store flash weekend promotion with bundled premium pouch at 15% discount",
          type: "discount"
        }
      ]
    }
  },
  9: {
    problem: {
      id: 9,
      product: "Amul Butter 500g",
      category: "grocery_fmcg",
      branch: "Ahmedabad",
      units_at_risk: 1200,
      value_at_risk: 318000,
      root_cause: "Distribution center over-ordered ahead of a festival that saw lower footfall than forecast. Stock is approaching 60-day shelf life window.",
      status: "analyzed"
    },
    sales_assessment: {
      sell_through_estimate_pct: 35,
      estimated_units_sold: 420,
      sales_reason: "Cold storage perishable dairy requires immediate commercial consumption before expiration deadline."
    },
    inventory_assessment: {
      inventory_issue: "Perishable inventory shelf-life risk; cold chain electricity overhead accumulates daily.",
      transfer_recommended: false,
      transfer_candidate: "None (Refrigerated inter-city freight cost exceeds margin benefit)",
      inventory_notes: "Maintain in local Ahmedabad territory. Prioritize institutional commercial kitchens with daily bulk turnover."
    },
    finance_assessment: {
      risk_level: "Critical - Shelf Life",
      expected_recovery: 265000,
      remaining_risk: 53000,
      finance_notes: "Expedited wholesale liquidation preserves ₹2.65L (83.3%) against total write-off risk."
    },
    external_options: [
      {
        name: "Ahmedabad Bakers & Confectioners Association (ABCA)",
        reason: "High volume daily butter consumption for commercial baking; buys in 50kg crates at 12-15% bulk concession.",
        source_url: "https://www.abca-gujarat.org",
        tag: "Commercial Kitchens"
      },
      {
        name: "Zomato Hyperpure B2B Restaurant Supply",
        reason: "Supplies hundreds of QSRs in Gujarat with daily dairy provisions, same-day pallet pickup.",
        source_url: "https://hyperpure.com",
        tag: "B2B Food Supply"
      }
    ],
    recommended_option: "Immediate Institutional Bulk Offload to Commercial Bakery Network",
    recovery_plan: {
      expected_recovery: 265000,
      remaining_risk: 53000,
      actions: [
        {
          units: 700,
          action: "Bulk supply to Commercial Bakery Association at ₹225/unit (15% wholesale discount)",
          type: "distributor"
        },
        {
          units: 300,
          action: "Supply to Hyperpure Cloud Kitchen network in Ahmedabad",
          type: "distributor"
        },
        {
          units: 200,
          action: "Local retail buy-2-get-1 bundle for high footfall residential outlets",
          type: "discount"
        }
      ]
    }
  },
  3: {
    problem: {
      id: 3,
      product: "Nike Air Zoom Pegasus 40",
      category: "footwear",
      branch: "Chennai",
      units_at_risk: 85,
      value_at_risk: 1019575,
      root_cause: "Inventory was built up ahead of a community marathon that was later cancelled.",
      status: "analyzed"
    },
    sales_assessment: {
      sell_through_estimate_pct: 50,
      estimated_units_sold: 42,
      sales_reason: "High performance running shoe with nationwide brand equity; demand remains resilient across running clubs."
    },
    inventory_assessment: {
      inventory_issue: "Local event cancellation isolated stock in Chennai.",
      transfer_recommended: true,
      transfer_candidate: "Bengaluru (Kanteerava Runner community) & Mumbai Marine Drive outlets.",
      inventory_notes: "Marathon season in Western India starts next month. High-priority transfer candidate."
    },
    finance_assessment: {
      risk_level: "Medium",
      expected_recovery: 890000,
      remaining_risk: 129575,
      finance_notes: "87.3% capital recovery projected through inter-city transfer and running club community outreach."
    },
    external_options: [
      {
        name: "Runners High India Athletic Collective",
        reason: "Direct partnership with 4,000+ registered marathon training members seeking footwear upgrades.",
        source_url: "https://www.runnershigh.in",
        tag: "Athletic Club"
      },
      {
        name: "SportsZone Surplus Wholesale Bangalore",
        reason: "Authorized sports gear distributor catering to university track & field teams.",
        source_url: "https://www.sportszone.co.in",
        tag: "Sports Liquidator"
      }
    ],
    recommended_option: "Inter-city Running Club Transfer + Bengaluru Athletic Partnership",
    recovery_plan: {
      expected_recovery: 890000,
      remaining_risk: 129575,
      actions: [
        {
          units: 45,
          action: "Transfer to Bengaluru & Mumbai flagship running specialty outlets",
          type: "transfer"
        },
        {
          units: 25,
          action: "Special member pricing promotion for affiliated running clubs",
          type: "discount"
        },
        {
          units: 15,
          action: "Wholesale allocation to SportsZone Athletic Team provider",
          type: "distributor"
        }
      ]
    }
  }
};
