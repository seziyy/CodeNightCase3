import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FileText, AlertCircle, CheckCircle, XCircle, Bell } from 'lucide-react';
import type { DecisionResponse, ActionType, NotificationResponse } from '../types';
import apiClient from '../services/api';
import NotificationModal from '../components/NotificationModal';

const Decisions: React.FC = () => {
  const [decisions, setDecisions] = useState<DecisionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [notificationSent, setNotificationSent] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponse | null>(null);

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<DecisionResponse[]>('/decisions');
      setDecisions(response.data);
    } catch (error) {
      console.error('Error loading decisions:', error);
      setError('Failed to load decisions');
    } finally {
      setLoading(false);
    }
  };

  const getActionMessage = (action: ActionType): string => {
    const messages: Record<ActionType, string> = {
      'BLOCK': 'İşleminiz güvenlik nedeniyle engellendi. Lütfen müşteri hizmetleri ile iletişime geçin.',
      'TEMPORARY_BLOCK': 'Hesabınız geçici olarak kilitlendi. 24 saat sonra tekrar deneyebilirsiniz.',
      'FORCE_2FA': 'Güvenlik nedeniyle ek doğrulama (2FA) zorunlu hale getirildi.',
      'PAYMENT_REVIEW': 'Ödemeniz manuel incelemeye alındı. En kısa zamanda sonuçlandırılacaktır.',
      'WARN': 'Güvenlik sistemi anormal aktivite tespit etti. Hesaplarınızı kontrol edin.',
      'REVIEW': 'İşleminiz incelemeye alınmıştır. Sonuç için lütfen bekleyiniz.',
      'BIP_NOTIFY': 'Hesabınızla ilgili önemli bir bildirim alınmıştır.',
      'LOG': 'Sisteme kayıt alınmıştır.',
      'ALLOW': 'İşleminiz başarıyla tamamlanmıştır.',
    };
    return messages[action] || 'Hesabınız hakkında önemli bir güvenlik bildirimi.';
  };

  const sendBipNotification = async (decision: DecisionResponse) => {
    try {
      const message = getActionMessage(decision.selectedAction);
      const response = await apiClient.post<NotificationResponse>(
        `/notifications/${decision.user.userId}`,
        null,
        { params: { message } }
      );
      
      setNotificationSent(prev => new Set([...prev, decision.decisionId]));
      setSelectedNotification(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error sending BiP notification:', error);
      alert('Bildirim gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case 'BLOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'TEMPORARY_BLOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PAYMENT_REVIEW':
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
    : decisions.filter(d => d.selectedAction === filter);

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadDecisions}
            className="mt-4 px-4 py-2 bg-turkcell-blue text-white rounded-lg hover:bg-turkcell-blue/90 transition-colors"
          >
            Retry
          </button>
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
              {action} ({decisions.filter(d => d.selectedAction === action).length})
            </button>
          ))}
        </div>
      </section>

      {/* Decisions List */}
      <section className="space-y-4" aria-label="Kararlar listesi">
        {filteredDecisions.map((decision) => (
          <article key={decision.decisionId} className="card hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-[#FFC500]" tabIndex={0} aria-label={`Karar ${decision.decisionId}, aksiyon ${decision.selectedAction}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-mono text-lg font-bold text-gray-900">
                    {decision.decisionId}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  User: <span className="font-mono font-medium">{decision.user.userId}</span>
                  {' • '}
                  Name: <span className="font-mono font-medium">{decision.user.name}</span>
                  {' • '}
                  City: <span className="font-mono font-medium">{decision.user.city}</span>
                  {' • '}
                  Segment: <span className="font-mono font-medium">{decision.user.segment}</span>
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
                {(decision.triggeredRules || '').split('|').filter(r => r.trim()).map((rule, index) => (
                  <span
                    key={index}
                    role="listitem"
                    className="px-3 py-1 bg-turkcell-blue/10 text-turkcell-blue border border-turkcell-blue/20 rounded-full text-sm font-medium"
                  >
                    {rule.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Actions:</p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Aksiyonlar">
                {/* Selected Action */}
                <div className={`px-4 py-2 rounded-lg border-2 font-bold text-sm flex items-center gap-2 ${getActionColor(decision.selectedAction)}`} role="listitem" aria-label={`Seçilen aksiyon: ${decision.selectedAction}`}>
                  <span aria-hidden="true">{getActionIcon(decision.selectedAction)}</span>
                  <span>{decision.selectedAction}</span>
                  <span className="ml-1 text-xs">(SELECTED)</span>
                </div>

                {/* Suppressed Actions */}
                {(decision.suppressedActions || '').split(',').filter(a => a.trim()).map((action, index) => (
                  <div
                    key={index}
                    role="listitem"
                    aria-label={`Baskılanmış aksiyon: ${action.trim()}`}
                    className={`px-4 py-2 rounded-lg border opacity-50 text-sm flex items-center gap-2 ${getActionColor(action.trim() as ActionType)}`}
                    style={{ textDecoration: 'line-through' }}
                  >
                    <span aria-hidden="true">{getActionIcon(action.trim() as ActionType)}</span>
                    <span>{action.trim()}</span>
                    <span className="ml-1 text-xs">(SUPPRESSED)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* BiP Notification Button */}
            <div className="flex gap-2">
              <button
                onClick={() => sendBipNotification(decision)}
                disabled={notificationSent.has(decision.decisionId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  notificationSent.has(decision.decisionId)
                    ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400'
                }`}
                aria-label={`${decision.user.name}'e BiP bildirimi gönder`}
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                {notificationSent.has(decision.decisionId) ? 'Bildirim Gönderildi' : 'BiP Bildirimi Gönder'}
              </button>
            </div>
          </article>
        ))}

        {filteredDecisions.length === 0 && (
          <div className="card text-center py-12" role="status" aria-live="polite">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600">No decisions found for the selected filter</p>
          </div>
        )}
      </section>

      {/* Notification Modal */}
      <NotificationModal 
        isOpen={modalOpen}
        notification={selectedNotification}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Decisions;
