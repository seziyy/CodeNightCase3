import type {
  Event,
  UserRisk,
  FraudCase,
  Decision,
  RiskRule,
  BipNotification,
  DashboardStats,
} from '../types';

// Mock Data Generator Functions
const generateMockEvents = (): Event[] => {
  const eventTypes: Array<'PAYMENT' | 'TRANSFER' | 'WITHDRAWAL' | 'LOGIN' | 'PROFILE_UPDATE' | 'PASSWORD_CHANGE'> = 
    ['PAYMENT', 'TRANSFER', 'WITHDRAWAL', 'LOGIN', 'PROFILE_UPDATE', 'PASSWORD_CHANGE'];
  const services: Array<'Paycell' | 'Kredi Kartı' | 'Hesap' | 'Mobil' | 'İnternet' | 'TV'> = 
    ['Paycell', 'Kredi Kartı', 'Hesap', 'Mobil', 'İnternet', 'TV'];
  const merchants = ['CryptoExchange', 'Amazon', 'Netflix', 'Spotify', 'E-commerce', 'İnternetten Alışveriş'];
  const devices = ['iPhone 13', 'Samsung S21', 'Desktop', 'iPad', 'Android Phone'];
  const locations = ['İstanbul', 'Ankara', 'İzmir', 'Londra', 'New York', 'Dubai'];
  const users = Array.from({ length: 20 }, (_, i) => `U${1000 + i}`);
  
  return Array.from({ length: 50 }, (_, i) => {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    
    return {
      event_id: `EV-${String(5000 + i).padStart(4, '0')}`,
      user_id: users[Math.floor(Math.random() * users.length)],
      service,
      event_type: eventType,
      value: Math.floor(Math.random() * 10000) + 100,
      unit: 'TRY',
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      risk_score: Math.floor(Math.random() * 100),
      risk_level: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
      meta: {
        device: devices[Math.floor(Math.random() * devices.length)],
        ip_risk: Math.random() > 0.6 ? 'HIGH' : Math.random() > 0.3 ? 'MEDIUM' : 'LOW',
        merchant: eventType === 'PAYMENT' ? merchants[Math.floor(Math.random() * merchants.length)] : undefined,
        location: locations[Math.floor(Math.random() * locations.length)],
      },
    };
  });
};

const generateMockUserRisks = (): UserRisk[] => {
  return Array.from({ length: 15 }, (_, i) => ({
    user_id: `user_${1000 + i}`,
    risk_score: Math.floor(Math.random() * 100),
    risk_level: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
    last_updated: new Date(Date.now() - Math.random() * 3600000 * 24).toISOString(),
    total_events: Math.floor(Math.random() * 100) + 1,
  }));
};

const generateMockFraudCases = (): FraudCase[] => {
  const statuses: ('OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'RESOLVED')[] = ['OPEN', 'IN_PROGRESS', 'CLOSED', 'RESOLVED'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    case_id: `case_${String(i + 1).padStart(5, '0')}`,
    user_id: `user_${1000 + Math.floor(Math.random() * 20)}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    risk_score: Math.floor(Math.random() * 100),
    created_at: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    description: `Suspicious activity detected for user`,
    assigned_to: Math.random() > 0.5 ? `admin_${Math.floor(Math.random() * 5) + 1}` : undefined,
  }));
};

const generateMockDecisions = (): Decision[] => {
  const actions: ('BLOCK' | 'WARN' | 'LOG' | 'ALLOW' | 'REVIEW' | 'BIP_NOTIFY')[] = [
    'BLOCK', 'WARN', 'LOG', 'ALLOW', 'REVIEW', 'BIP_NOTIFY'
  ];
  const rules = ['RULE_001', 'RULE_002', 'RULE_003', 'RULE_004', 'RULE_005'];
  
  return Array.from({ length: 100 }, (_, i) => {
    const selectedAction = actions[Math.floor(Math.random() * actions.length)];
    const triggeredRules = rules
      .filter(() => Math.random() > 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    const suppressedActions = actions
      .filter(a => a !== selectedAction && Math.random() > 0.6)
      .slice(0, Math.floor(Math.random() * 2));
    
    return {
      decision_id: `dec_${String(i + 1).padStart(5, '0')}`,
      event_id: `evt_${String(Math.floor(Math.random() * 50) + 1).padStart(5, '0')}`,
      user_id: `user_${1000 + Math.floor(Math.random() * 20)}`,
      triggered_rules: triggeredRules,
      selected_action: selectedAction,
      suppressed_actions: suppressedActions,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      risk_score: Math.floor(Math.random() * 100),
    };
  });
};

const generateMockRiskRules = (): RiskRule[] => {
  const actions: ('BLOCK' | 'WARN' | 'LOG' | 'ALLOW' | 'REVIEW' | 'BIP_NOTIFY')[] = [
    'BLOCK', 'WARN', 'LOG', 'ALLOW', 'REVIEW', 'BIP_NOTIFY'
  ];
  
  return [
    {
      rule_id: 'RULE_001',
      name: 'High Value Transaction',
      condition: 'transaction_amount > 5000',
      action: 'REVIEW',
      priority: 1,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z',
      description: 'Flag transactions over 5000 TL for review',
    },
    {
      rule_id: 'RULE_002',
      name: 'Multiple Failed Logins',
      condition: 'failed_login_count > 3',
      action: 'BLOCK',
      priority: 2,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z',
      description: 'Block account after 3 failed login attempts',
    },
    {
      rule_id: 'RULE_003',
      name: 'Suspicious IP Location',
      condition: 'ip_country != user_country',
      action: 'WARN',
      priority: 3,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z',
      description: 'Warn when login from different country',
    },
    {
      rule_id: 'RULE_004',
      name: 'Rapid Transactions',
      condition: 'transaction_count_1h > 10',
      action: 'BIP_NOTIFY',
      priority: 4,
      is_active: false,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z',
      description: 'Notify user via BiP for rapid transactions',
    },
    {
      rule_id: 'RULE_005',
      name: 'New Device Login',
      condition: 'device_id not in user_devices',
      action: 'LOG',
      priority: 5,
      is_active: true,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z',
      description: 'Log new device logins for audit',
    },
  ];
};

const generateMockNotifications = (): BipNotification[] => {
  const statuses: ('SENT' | 'DELIVERED' | 'FAILED' | 'PENDING')[] = ['SENT', 'DELIVERED', 'FAILED', 'PENDING'];
  const messages = [
    'Suspicious login attempt detected',
    'High-value transaction alert',
    'Account security warning',
    'Multiple failed login attempts',
    'New device login detected',
  ];
  
  return Array.from({ length: 40 }, (_, i) => ({
    notification_id: `notif_${String(i + 1).padStart(5, '0')}`,
    user_id: `user_${1000 + Math.floor(Math.random() * 20)}`,
    message: messages[Math.floor(Math.random() * messages.length)],
    sent_at: new Date(Date.now() - Math.random() * 86400000 * 14).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    event_id: Math.random() > 0.5 ? `evt_${String(Math.floor(Math.random() * 50) + 1).padStart(5, '0')}` : undefined,
  }));
};

// Mock data storage
let mockEvents = generateMockEvents();
let mockUserRisks = generateMockUserRisks();
let mockFraudCases = generateMockFraudCases();
let mockDecisions = generateMockDecisions();
let mockRiskRules = generateMockRiskRules();
let mockNotifications = generateMockNotifications();

// API Service Functions
export const eventService = {
  async getEvents(limit = 20): Promise<Event[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents.slice(0, limit).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }, 300);
    });
  },

  async createEvent(event: Omit<Event, 'event_id' | 'timestamp'>): Promise<Event> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent: Event = {
          ...event,
          event_id: `evt_${String(mockEvents.length + 1).padStart(5, '0')}`,
          timestamp: new Date().toISOString(),
        };
        mockEvents = [newEvent, ...mockEvents];
        resolve(newEvent);
      }, 300);
    });
  },
};

export const userRiskService = {
  async getUserRisks(): Promise<UserRisk[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUserRisks.sort((a, b) => b.risk_score - a.risk_score));
      }, 300);
    });
  },
};

export const fraudCaseService = {
  async getFraudCases(status?: string): Promise<FraudCase[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = status
          ? mockFraudCases.filter(c => c.status === status)
          : mockFraudCases;
        resolve(filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      }, 300);
    });
  },

  async updateCase(caseId: string, updates: Partial<FraudCase>): Promise<FraudCase> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFraudCases.findIndex(c => c.case_id === caseId);
        if (index === -1) {
          reject(new Error('Case not found'));
          return;
        }
        mockFraudCases[index] = {
          ...mockFraudCases[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        resolve(mockFraudCases[index]);
      }, 300);
    });
  },
};

export const decisionService = {
  async getDecisions(limit = 50): Promise<Decision[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDecisions.slice(0, limit).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      }, 300);
    });
  },
};

export const riskRuleService = {
  async getRiskRules(): Promise<RiskRule[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockRiskRules].sort((a, b) => a.priority - b.priority));
      }, 300);
    });
  },

  async updateRule(ruleId: string, updates: Partial<RiskRule>): Promise<RiskRule> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockRiskRules.findIndex(r => r.rule_id === ruleId);
        if (index === -1) {
          reject(new Error('Rule not found'));
          return;
        }
        mockRiskRules[index] = {
          ...mockRiskRules[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        resolve(mockRiskRules[index]);
      }, 300);
    });
  },
};

export const notificationService = {
  async getNotifications(limit = 30): Promise<BipNotification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNotifications.slice(0, limit).sort((a, b) => 
          new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
        ));
      }, 300);
    });
  },
};

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          total_events: mockEvents.length,
          high_risk_users: mockUserRisks.filter(u => u.risk_level === 'HIGH').length,
          open_cases: mockFraudCases.filter(c => c.status === 'OPEN' || c.status === 'IN_PROGRESS').length,
          active_rules: mockRiskRules.filter(r => r.is_active).length,
          recent_decisions: mockDecisions.filter(d => 
            new Date(d.timestamp).getTime() > Date.now() - 86400000
          ).length,
        });
      }, 300);
    });
  },
};
