import React, { useState } from 'react';
import { Menu, User, LogOut, Settings, Shield, AlertTriangle, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              TrustShield Admin
            </h2>
            <p className="text-sm text-gray-500">
              Fraud Detection & Risk Management Platform
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          <button
            onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFC500] hover:bg-[#FFD700] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2"
            aria-label="Admin menüsünü aç"
            aria-expanded={isAdminMenuOpen}
            aria-haspopup="true"
          >
            <User className="w-5 h-5 text-gray-900" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-900">Admin</span>
          </button>

          {/* Admin Dropdown Menu */}
          {isAdminMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsAdminMenuOpen(false)}
                aria-hidden="true"
              />
              <div 
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-50"
                role="menu"
                aria-label="Admin menüsü"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFC500] flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">admin@turkcell.com</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(true);
                      setIsAdminMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#FFC500]"
                    role="menuitem"
                    aria-label="Profili görüntüle"
                  >
                    <Shield className="w-5 h-5 text-gray-600" aria-hidden="true" />
                    <span className="text-sm text-gray-700">My Profile</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsAdminMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#FFC500]"
                    role="menuitem"
                    aria-label="Ayarları aç"
                  >
                    <Settings className="w-5 h-5 text-gray-600" aria-hidden="true" />
                    <span className="text-sm text-gray-700">Settings</span>
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-left">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && (
        <>
          <div 
            className="fixed inset-0 bg-[#FFC500] bg-opacity-40 z-50" 
            onClick={() => setIsProfileOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-2xl z-50 p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#FFC500] flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <User className="w-10 h-10 text-gray-900" />
              </div>
              <h2 id="profile-modal-title" className="text-2xl font-bold text-gray-900">Admin User</h2>
              <p className="text-sm text-gray-500 mt-1">admin@turkcell.com</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Role</p>
                <p className="text-sm font-semibold text-gray-900">System Administrator</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Status</p>
                <p className="text-sm font-semibold text-green-600">🟢 Active</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Last Login</p>
                <p className="text-sm font-semibold text-gray-900">Today at 09:30</p>
              </div>
            </div>

            <button 
              onClick={() => setIsProfileOpen(false)}
              className="w-full bg-[#FFC500] hover:bg-[#FFD700] text-gray-900 font-semibold py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#183E93] focus:ring-offset-2"
              aria-label="Profil modalını kapat"
            >
              Close
            </button>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <>
          <div 
            className="fixed inset-0 bg-[#FFC500] bg-opacity-40 z-50" 
            onClick={() => setIsSettingsOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-lg shadow-2xl z-50 p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
          >
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-[#FFC500]" aria-hidden="true" />
              <h2 id="settings-modal-title" className="text-2xl font-bold text-gray-900">Settings</h2>
            </div>

            <div className="space-y-3 mb-6" role="menu">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#FFC500]" role="menuitem" aria-label="Güvenlik ayarlarını aç">
                <Shield className="w-5 h-5 text-blue-600" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">Güvenlik Ayarları</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#FFC500]" role="menuitem" aria-label="Profili düzenle">
                <User className="w-5 h-5 text-green-600" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">Profil Düzenle</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#FFC500]" role="menuitem" aria-label="Hata bildir">
                <AlertTriangle className="w-5 h-5 text-red-600" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">Hata Bildir</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[#FFC500]" role="menuitem" aria-label="Yardım merkezini aç">
                <HelpCircle className="w-5 h-5 text-purple-600" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">Yardım Merkezi</span>
              </button>
            </div>

            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-[#FFC500] hover:bg-[#FFD700] text-gray-900 font-semibold py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#183E93] focus:ring-offset-2"
              aria-label="Ayarları kapat"
            >
              Kapat
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
