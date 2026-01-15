import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { 
  AlertTriangle, 
  TrendingUp, 
  AlertCircle, 
  Activity,
  Users,
  Target,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import type {
  Event,
  UserRisk,
  FraudCase,
  DashboardStats,
} from '../types';
import apiClient from '../services/api';

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [userRisks, setUserRisks] = useState<UserRisk[]>([]);
  const [fraudCases, setFraudCases] = useState<FraudCase[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Backend'den stats verilerini çek
      const statsResponse = await apiClient.get<DashboardStats>('/dashboard/stats');
      setStats(statsResponse.data);

      // Mock data kullan (şu an backend'de decisions, cases vb. endpoint'ler yok)
      // Production'da bunlar da API'den gelecek
      setEvents([]);
      setUserRisks([]);
      setFraudCases([]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'badge-high';
      case 'MEDIUM':
        return 'badge-medium';
      case 'LOW':
        return 'badge-low';
      default:
        return 'badge';
    }
  };

  const getRiskTextColorClass = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'text-red-600 font-semibold';
      case 'MEDIUM':
        return 'text-yellow-600 font-semibold';
      case 'LOW':
        return 'text-green-600 font-semibold';
      default:
        return 'text-gray-600';
    }
  };

  const getRiskBgClass = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-red-50 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-50 border-yellow-200';
      case 'LOW':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: tr });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-turkcell-blue mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="staggered-reveal staggered-delay-1" role="banner">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of fraud detection and risk management</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="İstatistik kartları">
        {/* Total Events */}
        <article className="group card staggered-reveal staggered-delay-2 hover:shadow-lg hover:border-turkcell-blue transition-all" role="article" aria-label="Toplam olaylar">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-turkcell-blue" aria-hidden="true" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Toplam Olaylar</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
              <p className="text-xs text-gray-500 mt-2">Son 24 saatte işlenen</p>
            </div>
            <div className="rounded-lg bg-turkcell-blue/10 p-3 group-hover:bg-turkcell-blue/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-turkcell-blue" aria-hidden="true" />
            </div>
          </div>
        </article>

        {/* High Risk Users */}
        <article className="group card staggered-reveal staggered-delay-3 hover:shadow-lg hover:border-red-300 transition-all" role="article" aria-label="Yüksek riskli kullanıcılar">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" aria-hidden="true" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Yüksek Risk Kullanıcı</p>
              </div>
              <p className="text-3xl font-bold text-red-600">{stats?.highRiskUsers || 0}</p>
              <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> Risk seviyesi yükseliyor
              </p>
            </div>
            <div className="rounded-lg bg-red-100 p-3 group-hover:bg-red-200 transition-colors">
              <Users className="w-6 h-6 text-red-600" aria-hidden="true" />
            </div>
          </div>
        </article>

        {/* Open Cases */}
        <article className="group card staggered-reveal staggered-delay-4 hover:shadow-lg hover:border-yellow-300 transition-all" role="article" aria-label="Açık vakalar">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-yellow-600" aria-hidden="true" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Açık Vakalar</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats?.openCases || 0}</p>
              <p className="text-xs text-yellow-600 mt-2">İnceleme bekleyen</p>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3 group-hover:bg-yellow-200 transition-colors">
              <AlertCircle className="w-6 h-6 text-yellow-600" aria-hidden="true" />
            </div>
          </div>
        </article>

        {/* Active Rules */}
        <article className="group card staggered-reveal staggered-delay-5 hover:shadow-lg hover:border-green-300 transition-all" role="article" aria-label="Aktif kurallar">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-green-600" aria-hidden="true" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktif Kurallar</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats?.activeRules || 0}</p>
              <p className="text-xs text-green-600 mt-2">Sistemi koruyuyor</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
              <Target className="w-6 h-6 text-green-600" aria-hidden="true" />
            </div>
          </div>
        </article>
      </section>

      {/* Recent Events - Şu an boş */}
      {events.length > 0 && (
      <section className="card staggered-reveal staggered-delay-6" aria-labelledby="recent-events-heading">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 id="recent-events-heading" className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-turkcell-blue" aria-hidden="true" />
              Son Olaylar
            </h2>
            <p className="text-xs text-gray-500 mt-1">Sistem tarafından kaydedilen en son 10 olay</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Canlı
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto" role="region" aria-label="Son olaylar tablosu" tabIndex={0}>
          <table className="w-full" role="table" aria-label="Son olaylar listesi">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Event ID</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-gray-600">User ID</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Service</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Event Type</th>
                <th scope="col" className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Value</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Meta</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Risk</th>
                <th scope="col" className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.event_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-mono text-gray-700">{event.event_id}</td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-700">{event.user_id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{event.service}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{event.event_type}</td>
                  <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                    {event.value.toLocaleString('tr-TR')} {event.unit || 'TL'}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {event.meta && typeof event.meta === 'object' && (
                      <div className="space-y-1">
                        {event.meta.device && <div className="text-gray-600">📱 {event.meta.device}</div>}
                        {event.meta.merchant && <div className="text-blue-600">🏪 {event.meta.merchant}</div>}
                        {event.meta.location && <div className="text-gray-600">📍 {event.meta.location}</div>}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {event.risk_level && (
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg font-semibold text-sm ${getRiskBgClass(event.risk_level)}`}>
                        <span className={`w-2 h-2 rounded-full ${
                          event.risk_level === 'HIGH' ? 'bg-red-500' :
                          event.risk_level === 'MEDIUM' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></span>
                        <span className={getRiskTextColorClass(event.risk_level)}>
                          {event.risk_level}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(event.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Risk Levels - Şu an boş */}
        {userRisks.length > 0 && (
        <section className="card staggered-reveal staggered-delay-7" aria-labelledby="top-risk-users-heading">
          <h2 id="top-risk-users-heading" className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" aria-hidden="true" />
            Yüksek Risk Kullanıcılar
          </h2>
          
          <div className="space-y-3" role="list" aria-label="Yüksek riskli kullanıcılar listesi">
            {userRisks.map((user) => (
              <div
                key={user.user_id}
                role="listitem"
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all focus-within:ring-2 focus-within:ring-[#FFC500] ${getRiskBgClass(user.risk_level)} hover:shadow-md`}
                tabIndex={0}
                aria-label={`Kullanıcı ${user.user_id}, risk skoru ${user.risk_score}, risk seviyesi ${user.risk_level}`}
              >
                <div className="flex-1">
                  <p className="font-mono text-sm font-medium text-gray-900">{user.user_id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.total_events} events • Last: {formatDate(user.last_updated)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getRiskTextColorClass(user.risk_level)}`}>{user.risk_score}</p>
                    <p className="text-xs text-gray-500">score</p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-sm border-2 ${
                    user.risk_level === 'HIGH' ? 'bg-red-100 text-red-700 border-red-300' :
                    user.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    'bg-green-100 text-green-700 border-green-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      user.risk_level === 'HIGH' ? 'bg-red-600' :
                      user.risk_level === 'MEDIUM' ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`}></span>
                    {user.risk_level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Open Fraud Cases - Şu an boş */}
        {fraudCases.length > 0 && (
        <section className="card staggered-reveal staggered-delay-8" aria-labelledby="open-fraud-cases-heading">
          <h2 id="open-fraud-cases-heading" className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-600" aria-hidden="true" />
            Açık Dolandırıcılık Vakaları
          </h2>
          
          <div className="space-y-3" role="list" aria-label="Açık dolandırıcılık vakaları listesi">
            {fraudCases.map((fraudCase) => (
              <div
                key={fraudCase.case_id}
                role="listitem"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-turkcell-blue transition-colors focus-within:ring-2 focus-within:ring-[#FFC500]"
                tabIndex={0}
                aria-label={`Vaka ${fraudCase.case_id}, durum ${fraudCase.status}, risk skoru ${fraudCase.risk_score}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-medium text-gray-900">{fraudCase.case_id}</p>
                    <span className={`badge ${
                      fraudCase.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`} aria-label={`Vaka durumu: ${fraudCase.status}`}>
                      {fraudCase.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    User: {fraudCase.user_id} • {fraudCase.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    fraudCase.risk_score >= 70 ? 'text-red-600' :
                    fraudCase.risk_score >= 40 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>{fraudCase.risk_score}</p>
                  <p className="text-xs text-gray-500">score</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
