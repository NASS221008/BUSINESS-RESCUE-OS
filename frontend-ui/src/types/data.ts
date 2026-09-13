export interface ProblemItem {
  id: number;
  product_id?: number;
  product_name: string;
  category: string;
  branch: string;
  units_in_stock: number;
  unit_price: number;
  problem_type: string;
  units_at_risk: number;
  value_at_risk: number;
  root_cause: string;
  status: 'detected' | 'analyzed' | 'approved';
  has_report?: boolean;
  approved?: boolean;
  expected_recovery?: number | null;
}

export interface ExternalOption {
  name: string;
  reason: string;
  source_url: string;
  tag?: string;
}

export interface RecoveryAction {
  units: number;
  action: string;
  type?: 'transfer' | 'discount' | 'distributor' | 'liquidation' | 'bundle';
}

export interface SalesAssessment {
  sell_through_estimate_pct: number;
  estimated_units_sold: number;
  sales_reason: string;
}

export interface InventoryAssessment {
  inventory_issue: string;
  transfer_recommended: boolean;
  transfer_candidate: string;
  inventory_notes: string;
}

export interface FinanceAssessment {
  risk_level: string;
  expected_recovery: number;
  remaining_risk: number;
  finance_notes: string;
}

export interface RecoveryReportData {
  problem: {
    id?: number;
    product?: string;
    product_name?: string;
    category?: string;
    branch?: string;
    units_at_risk: number;
    value_at_risk: number;
    root_cause: string;
    status?: string;
  };
  sales_assessment?: SalesAssessment;
  inventory_assessment?: InventoryAssessment;
  finance_assessment?: FinanceAssessment;
  external_options: ExternalOption[];
  recommended_option: string;
  recovery_plan: {
    expected_recovery: number;
    remaining_risk: number;
    actions: RecoveryAction[];
  };
  approved?: boolean;
}

export interface SystemStats {
  total_problems: number;
  total_value_at_risk: number;
  total_expected_recovery: number;
  total_remaining_risk: number;
  approved_count: number;
  analyzed_count: number;
  categories: Record<string, number>;
  branches: Record<string, number>;
}

export interface AgentTelemetry {
  id: string;
  name: string;
  icon: string;
  model: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  latencyMs: number;
  detail: string;
}
