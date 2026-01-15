import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type { Decision, ActionType } from '../types';
import { decisionService } from '../services/dataService';

const Decisions: React.FC = () => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    setLoading(true);
    try {
      const data = await decisionService.getDecisions();
      setDecisions(data);
    } catch (error) {
      console.error('Error loading decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case 'BLOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BIP_NOTIFY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'LOG':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ALLOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionIcon = (action: ActionType) => {
    switch (action) {
      case 'BLOCK':
        return <XCircle className="w-4 h-4" />;
      case 'WARN':
        return <AlertCircle className="w-4 h-4" />;
      case 'ALLOW':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm:ss', { locale: tr });
  };

  const filteredDecisions = filter === 'all' 
    ? decisions 
    : decisions.filter(d => d.selected_action === filter);

  const actionTypes: ActionType[] = ['BLOCK', 'WARN', 'LOG', 'ALLOW', 'REVIEW', 'BIP_NOTIFY'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <div className="text-center">
          <FileText className="w-12 h-12 animate-pulse text-turkcell-blue mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600">Loading decisions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header role="banner">
        <h1 className="text-3xl font-bold text-gray-900">Decisions & Audit Log</h1>
        <p className="text-gray-600 mt-1">System decisions with triggered rules and actions</p>
      </header>

      {/* Filters */}
      <section className="card" role="toolbar" aria-label="Karar filtreleri">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            aria-label="Tüm kararları göster"
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 ${
              filter === 'all'
                ? 'bg-turkcell-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({decisions.length})
          </button>
          {actionTypes.map((action) => (
            <button
              key={action}
              onClick={() => setFilter(action)}
              aria-pressed={filter === action}
              aria-label={`${action} aksiyonlarını göster`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 ${
                filter === action
                  ? 'bg-turkcell-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {action} ({decisions.filter(d => d.selected_action === action).length})
            </button>
          ))}
        </div>
      </section>

      {/* Decisions List */}
      <section className="space-y-4" aria-label="Kararlar listesi">
        {filteredDecisions.map((decision) => (
          <article key={decision.decision_id} className="card hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[#FFC500]" tabIndex={0} aria-label={`Karar ${decision.decision_id}, aksiyon ${decision.selected_action}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-mono text-lg font-bold text-gray-900">
                    {decision.decision_id}
                  </h3>
                  <span className="badge bg-gray-100 text-gray-700">
                    Event: {decision.event_id}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  User: <span className="font-mono font-medium">{decision.user_id}</span>
                  {' • '}
                  Risk Score: <span className="font-bold text-gray-900">{decision.risk_score}</span>
                </p>
              </div>
              <div className="text-right text-sm text-gray-500">
                {formatDate(decision.timestamp)}
              </div>
            </div>

            {/* Triggered Rules */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Triggered Rules:</p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Tetiklenen kurallar">
                {decision.triggered_rules.map((rule, index) => (
                  <span
                    key={index}
                    role="listitem"
                    className="px-3 py-1 bg-turkcell-blue/10 text-turkcell-blue border border-turkcell-blue/20 rounded-full text-sm font-medium"
                  >
                    {rule}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Actions:</p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Aksiyonlar">
                {/* Selected Action */}
                <div className={`px-4 py-2 rounded-lg border-2 font-bold text-sm flex items-center gap-2 ${getActionColor(decision.selected_action)}`} role="listitem" aria-label={`Seçilen aksiyon: ${decision.selected_action}`}>
                  <span aria-hidden="true">{getActionIcon(decision.selected_action)}</span>
                  <span>{decision.selected_action}</span>
                  <span className="ml-1 text-xs">(SELECTED)</span>
                </div>

                {/* Suppressed Actions */}
                {decision.suppressed_actions.map((action, index) => (
                  <div
                    key={index}
                    role="listitem"
                    aria-label={`Baskılanmış aksiyon: ${action}`}
                    className={`px-4 py-2 rounded-lg border opacity-50 text-sm flex items-center gap-2 ${getActionColor(action)}`}
                    style={{ textDecoration: 'line-through' }}
                  >
                    <span aria-hidden="true">{getActionIcon(action)}</span>
                    <span>{action}</span>
                    <span className="ml-1 text-xs">(SUPPRESSED)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            {decision.details && Object.keys(decision.details).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Additional Details:</p>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto text-gray-700" aria-label="Ek detaylar">
                  {JSON.stringify(decision.details, null, 2)}
                </pre>
              </div>
            )}
          </article>
        ))}

        {filteredDecisions.length === 0 && (
          <div className="card text-center py-12" role="status" aria-live="polite">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600">No decisions found for the selected filter</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Decisions;
