import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Shield, Edit2, Save, X, Search, Filter, Zap, AlertCircle } from 'lucide-react';
import type { RiskRuleResponse, ActionType } from '../types';
import apiClient from '../services/api';

const RiskRules: React.FC = () => {
  const [rules, setRules] = useState<RiskRuleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriority, setEditPriority] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [selectedRules, setSelectedRules] = useState<Set<string>>(new Set());
  const [bulkPriority, setBulkPriority] = useState<number>(1);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RiskRuleResponse[]>('/risk-rules');
      setRules(response.data);
    } catch (error) {
      console.error('Error loading rules:', error);
      setError('Failed to load risk rules');
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: boolean) => {
    try {
      const updatedRule = await apiClient.put(`/risk-rules/${ruleId}`, {
        active: !currentStatus,
      });
      setRules(rules.map(r => r.ruleId === ruleId ? updatedRule.data : r));
    } catch (error) {
      console.error('Error updating rule status:', error);
    }
  };

  const startEditingPriority = (rule: RiskRuleResponse) => {
    setEditingId(rule.ruleId);
    setEditPriority(rule.priority);
  };

  const savePriority = async (ruleId: string) => {
    try {
      const updatedRule = await apiClient.put(`/risk-rules/${ruleId}`, {
        priority: editPriority,
      });
      setRules(rules.map(r => r.ruleId === ruleId ? updatedRule.data : r));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditPriority(0);
  };

  const toggleRuleSelection = (ruleId: string) => {
    const newSelected = new Set(selectedRules);
    if (newSelected.has(ruleId)) {
      newSelected.delete(ruleId);
    } else {
      newSelected.add(ruleId);
    }
    setSelectedRules(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRules.size === filteredRules.length && filteredRules.length > 0) {
      setSelectedRules(new Set());
    } else {
      setSelectedRules(new Set(filteredRules.map(r => r.rule_id)));
    }
  };

  const bulkToggleStatus = async (newStatus: boolean) => {
    try {
      const promises = Array.from(selectedRules).map(ruleId => 
        apiClient.put(`/risk-rules/${ruleId}`, { active: newStatus })
      );
      const responses = await Promise.all(promises);
      const updatedRules = responses.map(r => r.data);
      setRules(rules.map(r => {
        const updated = updatedRules.find(u => u.ruleId === r.ruleId);
        return updated || r;
      }));
      setSelectedRules(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error bulk updating status:', error);
    }
  };

  const bulkUpdatePriority = async () => {
    try {
      const promises = Array.from(selectedRules).map(ruleId => 
        apiClient.put(`/risk-rules/${ruleId}`, { priority: bulkPriority })
      );
      const responses = await Promise.all(promises);
      const updatedRules = responses.map(r => r.data);
      setRules(rules.map(r => {
        const updated = updatedRules.find(u => u.ruleId === r.ruleId);
        return updated || r;
      }));
      setSelectedRules(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error bulk updating priority:', error);
    }
  };

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.ruleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        rule.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && rule.active) ||
                         (filterStatus === 'inactive' && !rule.active);
    const matchesAction = filterAction === 'all' || rule.action === filterAction;
    return matchesSearch && matchesStatus && matchesAction;
  });

  const uniqueActions = Array.from(new Set(rules.map(r => r.action))).sort();

  const getActionColor = (action: string) => {
    switch (action) {
      case 'BLOCK':
        return 'bg-red-100 text-red-800';
      case 'FORCE_2FA':
        return 'bg-orange-100 text-orange-800';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW':
      case 'PAYMENT_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'BIP_NOTIFY':
        return 'bg-purple-100 text-purple-800';
      case 'LOG':
        return 'bg-gray-100 text-gray-800';
      case 'ALLOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: tr });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <div className="text-center">
          <Shield className="w-12 h-12 animate-pulse text-turkcell-blue mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-600">Loading risk rules...</p>
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
            onClick={loadRules}
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
        <h1 className="text-3xl font-bold text-gray-900">Risk Rule Management</h1>
        <p className="text-gray-600 mt-1">Manage fraud detection rules and their priorities</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Risk kuralı istatistikleri">
        <article className="card" role="article" aria-label="Toplam kurallar">
          <p className="text-sm text-gray-600">Total Rules</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{rules.length}</p>
        </article>
        <article className="card" role="article" aria-label="Aktif kurallar">
          <p className="text-sm text-gray-600">Active Rules</p>
          <p className="text-2xl font-bold text-risk-low mt-1">
            {rules.filter(r => r.active).length}
          </p>
        </article>
        <article className="card" role="article" aria-label="İnaktif kurallar">
          <p className="text-sm text-gray-600">Inactive Rules</p>
          <p className="text-2xl font-bold text-gray-500 mt-1">
            {rules.filter(r => !r.active).length}
          </p>
        </article>
      </section>

      {/* Search & Filters */}
      <section className="card space-y-4" aria-label="Arama ve filtreleme">
        <div className="flex gap-3 flex-col lg:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Kural ID veya condition'a göre ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-turkcell-blue"
              aria-label="Kural arama"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-turkcell-blue"
            aria-label="Duruma göre filtrele"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">İnaktif</option>
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-turkcell-blue"
            aria-label="İşleme göre filtrele"
          >
            <option value="all">Tüm İşlemler</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedRules.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-blue-900">
                {selectedRules.size} kural seçildi
              </p>
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-1"
              >
                {showBulkActions ? 'Gizle' : 'İşlemler'}
              </button>
            </div>

            {showBulkActions && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => bulkToggleStatus(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                  aria-label="Seçili kuralları etkinleştir"
                >
                  Tümünü Etkinleştir
                </button>
                <button
                  onClick={() => bulkToggleStatus(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                  aria-label="Seçili kuralları devre dışı bırak"
                >
                  Tümünü Devre Dışı Bırak
                </button>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bulkPriority}
                    onChange={(e) => setBulkPriority(parseInt(e.target.value) || 1)}
                    min="1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-turkcell-blue"
                    aria-label="Toplu öncelik değeri"
                  />
                  <button
                    onClick={bulkUpdatePriority}
                    className="px-4 py-2 bg-turkcell-blue text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#FFC500] transition-colors flex items-center gap-2"
                    aria-label="Öncelikleri güncelle"
                  >
                    <Zap className="w-4 h-4" aria-hidden="true" />
                    Güncelle
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Rules Table */}
      <section className="card" aria-labelledby="rules-table-heading">
        <h2 id="rules-table-heading" className="sr-only">Risk kuralları tablosu</h2>
        <div className="mb-4 text-sm text-gray-600">
          {filteredRules.length} / {rules.length} kural gösterildi
        </div>
        <div className="overflow-x-auto" role="region" aria-label="Risk kuralları listesi" tabIndex={0}>
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedRules.size === filteredRules.length && filteredRules.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    aria-label="Tüm kuralları seç/seçme"
                  />
                </th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Priority</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Rule ID</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Condition</th>
                <th scope="col" className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.map((rule) => (
                <tr
                  key={rule.ruleId}
                  className={`border-b transition-all duration-300 ${
                    !rule.active
                      ? 'opacity-60 bg-gray-50/50 border-gray-100'
                      : 'hover:bg-gray-50 border-gray-100'
                  } ${selectedRules.has(rule.ruleId) ? 'bg-blue-100' : ''}`}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRules.has(rule.ruleId)}
                      onChange={() => toggleRuleSelection(rule.ruleId)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      aria-label={`${rule.ruleId} kuralını seç`}
                    />
                  </td>
                  {/* Status Toggle with iOS Style */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {/* Peer-based Custom Toggle Switch */}
                      <div className="relative inline-flex items-center">
                        <input
                          type="checkbox"
                          id={`toggle-${rule.ruleId}`}
                          checked={rule.active}
                          onChange={() => toggleRuleStatus(rule.ruleId, rule.active)}
                          className="peer sr-only cursor-pointer"
                          role="switch"
                          aria-checked={rule.active}
                          aria-label={`Kural ${rule.ruleId} durumunu ${rule.active ? 'devre dışı bırak' : 'etkinleştir'}`}
                        />
                        {/* Toggle Background */}
                        <label
                          htmlFor={`toggle-${rule.ruleId}`}
                          className={`relative inline-block w-14 h-7 rounded-full cursor-pointer transition-all duration-300 ${
                            rule.active
                              ? 'bg-[#001a33] shadow-lg shadow-blue-900/50'
                              : 'bg-slate-300 shadow-md shadow-gray-400/30'
                          } peer-focus:ring-2 peer-focus:ring-[#FFC500] peer-focus:ring-offset-2`}
                        >
                          {/* Toggle Thumb (Circle) */}
                          <span
                            className={`absolute top-1 left-1 inline-block w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md ${
                              rule.active
                                ? 'translate-x-7 shadow-blue-900/40'
                                : 'translate-x-0 shadow-gray-500/30'
                            }`}
                            aria-hidden="true"
                          />
                        </label>
                      </div>

                      {/* Status Text Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                          rule.active
                            ? 'bg-green-100 text-[#001a33] border border-green-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {rule.active ? '✓ Aktif' : '✕ Pasif'}
                      </span>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4">
                    {editingId === rule.ruleId ? (
                      <div className="flex items-center gap-2" role="group" aria-label="Öncelik düzenleme">
                        <input
                          type="number"
                          value={editPriority}
                          onChange={(e) => setEditPriority(parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-turkcell-blue"
                          min="1"
                          aria-label="Öncelik değeri"
                        />
                        <button
                          onClick={() => savePriority(rule.ruleId)}
                          className="p-1 text-green-600 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                          aria-label="Önceliği kaydet"
                        >
                          <Save className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                          aria-label="Düzenlemeyi iptal et"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-lg">{rule.priority}</span>
                        <button
                          onClick={() => startEditingPriority(rule)}
                          className="p-1 text-gray-400 hover:text-turkcell-blue focus:outline-none focus:ring-2 focus:ring-[#FFC500] rounded"
                          aria-label="Önceliği düzenle"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Rule ID */}
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {rule.ruleId}
                    </span>
                  </td>

                  {/* Condition */}
                  <td className="py-4 px-4 max-w-md">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 break-words">
                      {rule.condition}
                    </code>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4">
                    <span className={`badge ${getActionColor(rule.action)}`}>
                      {rule.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Legend */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-3">Action Types Legend:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="badge bg-red-100 text-red-800">BLOCK</span>
            <span className="text-sm text-gray-600">Block the action</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-orange-100 text-orange-800">FORCE_2FA</span>
            <span className="text-sm text-gray-600">Force 2FA verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-yellow-100 text-yellow-800">WARN</span>
            <span className="text-sm text-gray-600">Issue warning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-blue-100 text-blue-800">REVIEW</span>
            <span className="text-sm text-gray-600">Manual review required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-blue-100 text-blue-800">PAYMENT_REVIEW</span>
            <span className="text-sm text-gray-600">Payment review needed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-purple-100 text-purple-800">BIP_NOTIFY</span>
            <span className="text-sm text-gray-600">Send BiP notification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-gray-100 text-gray-800">LOG</span>
            <span className="text-sm text-gray-600">Log for audit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-green-100 text-green-800">ALLOW</span>
            <span className="text-sm text-gray-600">Allow action</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskRules;
