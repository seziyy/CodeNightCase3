import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Bell, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import type { BipNotification } from '../types';
import { notificationService } from '../services/dataService';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<BipNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'SENT':
        return <Send className="w-5 h-5 text-blue-600" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm:ss', { locale: tr });
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.status === filter);

  const statusCounts = {
    all: notifications.length,
    DELIVERED: notifications.filter(n => n.status === 'DELIVERED').length,
    SENT: notifications.filter(n => n.status === 'SENT').length,
    FAILED: notifications.filter(n => n.status === 'FAILED').length,
    PENDING: notifications.filter(n => n.status === 'PENDING').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <div className="text-center">
          <Bell className="w-12 h-12 animate-pulse text-turkcell-blue mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header role="banner">
        <h1 className="text-3xl font-bold text-gray-900">BiP Notifications</h1>
        <p className="text-gray-600 mt-1">User notification history via BiP messaging</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" aria-label="Bildirim istatistikleri">
        <article className="card" role="article" aria-label="Toplam bildirimler">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.all}</p>
            </div>
            <Bell className="w-8 h-8 text-turkcell-blue" aria-hidden="true" />
          </div>
        </article>

        <article className="card" role="article" aria-label="Teslim edildi">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.DELIVERED}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
          </div>
        </article>

        <article className="card" role="article" aria-label="Gönderildi">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{statusCounts.SENT}</p>
            </div>
            <Send className="w-8 h-8 text-blue-600" aria-hidden="true" />
          </div>
        </article>

        <article className="card" role="article" aria-label="Başarısız">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts.FAILED}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" aria-hidden="true" />
          </div>
        </article>

        <article className="card" role="article" aria-label="Beklemede">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.PENDING}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" aria-hidden="true" />
          </div>
        </article>
      </section>

      {/* Filters */}
      <section className="card" role="toolbar" aria-label="Bildirim filtreleri">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            aria-label="Tüm bildirimleri göster"
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 ${
              filter === 'all'
                ? 'bg-turkcell-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilter('DELIVERED')}
            aria-pressed={filter === 'DELIVERED'}
            aria-label="Teslim edilen bildirimleri göster"
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 ${
              filter === 'DELIVERED'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Delivered ({statusCounts.DELIVERED})
          </button>
          <button
            onClick={() => setFilter('SENT')}
            aria-pressed={filter === 'SENT'}
            aria-label="Gönderilen bildirimleri göster"
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 ${
              filter === 'SENT'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sent ({statusCounts.SENT})
          </button>
          <button
            onClick={() => setFilter('FAILED')}
            aria-pressed={filter === 'FAILED'}
            aria-label="Başarısız bildirimleri göster"
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 ${
              filter === 'FAILED'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Failed ({statusCounts.FAILED})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            aria-pressed={filter === 'PENDING'}
            aria-label="Bekleyen bildirimleri göster"
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 ${
              filter === 'PENDING'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({statusCounts.PENDING})
          </button>
        </div>
      </section>

      {/* Notifications Table */}
      <section className="card" aria-labelledby="notifications-table-heading">
        <h2 id="notifications-table-heading" className="sr-only">Bildirimler tablosu</h2>
        <div className="overflow-x-auto" role="region" aria-label="Bildirimler listesi" tabIndex={0}>
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Notification ID</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">User ID</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Message</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Event ID</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((notification) => (
                <tr key={notification.notification_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(notification.status)}
                      <span className={`badge border ${getStatusColor(notification.status)}`} aria-label={`Durum: ${notification.status}`}>
                        {notification.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {notification.notification_id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-gray-700">
                      {notification.user_id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900 max-w-md">
                      {notification.message}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    {notification.event_id ? (
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                        {notification.event_id}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(notification.sent_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12" role="status" aria-live="polite">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-600">No notifications found for the selected filter</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;
