import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationData {
  notificationId: string;
  userId: string;
  userName: string;
  userCity: string;
  userSegment: string;
  message: string;
  channel: string;
  sentAt: string;
  status: string;
  mockMode: boolean;
  statusMessage: string;
}

interface NotificationModalProps {
  isOpen: boolean;
  notification: NotificationData | null;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, notification, onClose }) => {
  if (!isOpen || !notification) return null;

  const isSuccess = notification.status === 'SUCCESS';
  const sentDate = new Date(notification.sentAt);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        {/* Header */}
        <div className={`p-6 border-b ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isSuccess ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h2 className={`text-lg font-bold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                  {notification.statusMessage}
                </h2>
                {notification.mockMode && (
                  <p className="text-sm text-orange-600 mt-1">🔸 Mock Modu (Test Amaçlı)</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Kullanıcı ID</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{notification.userId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Bildirim ID</p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 truncate" title={notification.notificationId}>
                {notification.notificationId.substring(0, 20)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Adı Soyadı</p>
              <p className="text-sm font-semibold mt-1">{notification.userName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Şehir</p>
              <p className="text-sm font-semibold mt-1">{notification.userCity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Segment</p>
              <p className="text-sm font-semibold mt-1">{notification.userSegment}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Kanal</p>
              <p className="text-sm font-semibold mt-1 text-blue-600">{notification.channel}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Mesaj</p>
            <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-gray-700 whitespace-pre-wrap">
              {notification.message}
            </div>
          </div>

          {/* Sent Date */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Gönderilme Zamanı</p>
            <p className="text-sm mt-1">
              {sentDate.toLocaleDateString('tr-TR')} {sentDate.toLocaleTimeString('tr-TR')}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Durum:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isSuccess 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {notification.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
