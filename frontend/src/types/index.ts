// Risk Levels
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

// Case Status
export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED';

// Segment Types
export type SegmentType = 'INDIVIDUAL' | 'CORPORATE' | 'SME';

// Action Types
export type ActionType = 'BLOCK' | 'WARN' | 'LOG' | 'ALLOW' | 'REVIEW' | 'BIP_NOTIFY' | 'TEMPORARY_BLOCK' | 'PAYMENT_REVIEW' | 'FORCE_2FA';

// Event Types
export type EventType = 'PAYMENT' | 'TRANSFER' | 'WITHDRAWAL' | 'LOGIN' | 'PROFILE_UPDATE' | 'PASSWORD_CHANGE';
export type ServiceType = 'Paycell' | 'Kredi Kartı' | 'Hesap' | 'Mobil' | 'İnternet' | 'TV';

// User Interface
export interface User {
  userId: string;
  name: string;
  city: string;
  segment: SegmentType;
  hibernateLazyInitializer?: Record<string, any>;
}

// Event Meta Interface
export interface EventMeta {
  device?: string;
  ip_risk?: 'LOW' | 'MEDIUM' | 'HIGH';
  merchant?: string;
  location?: string;
  [key: string]: any;
}

// Event Interface
export interface Event {
  event_id: string;
  user_id: string;
  service: ServiceType;
  event_type: EventType;
  value: number;
  unit?: string;
  timestamp: string;
  risk_score?: number;
  risk_level?: RiskLevel;
  meta?: EventMeta | string;
}

// User Risk Interface
export interface UserRisk {
  user_id: string;
  risk_score: number;
  risk_level: RiskLevel;
  last_updated: string;
  total_events: number;
}

// Fraud Case Interface
export interface FraudCase {
  case_id: string;
  user_id: string;
  status: CaseStatus;
  risk_score: number;
  created_at: string;
  updated_at: string;
  description: string;
  assigned_to?: string;
}

// Decision Interface
export interface Decision {
  decision_id: string;
  event_id: string;
  user_id: string;
  triggered_rules: string[];
  selected_action: ActionType;
  suppressed_actions: ActionType[];
  timestamp: string;
  risk_score: number;
  details?: Record<string, any>;
}

// Decision Response Interface (from API)
export interface DecisionResponse {
  decisionId: string;
  user: User;
  triggeredRules: string;
  selectedAction: ActionType;
  suppressedActions: string;
  timestamp: string;
}

// Risk Rule Interface
export interface RiskRule {
  rule_id: string;
  name: string;
  condition: string;
  action: ActionType;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  description?: string;
}

// Risk Rule Response Interface (from API)
export interface RiskRuleResponse {
  ruleId: string;
  condition: string;
  action: ActionType;
  priority: number;
  active: boolean;
}

// BiP Notification Interface
export interface BipNotification {
  notification_id: string;
  user_id: string;
  message: string;
  sent_at: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED' | 'PENDING';
  event_id?: string;
}

// Stats Interface
export interface DashboardStats {
  total_events: number;
  high_risk_users: number;
  open_cases: number;
  active_rules: number;
  recent_decisions: number;
}
