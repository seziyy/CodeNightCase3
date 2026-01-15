import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Shield, 
  Bell,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/decisions', icon: FileText, label: 'Decisions & Audit' },
    { path: '/rules', icon: Shield, label: 'Risk Rules' },
    { path: '/notifications', icon: Bell, label: 'BiP Notifications' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#183E93] text-white transform transition-transform duration-300 z-50 lg:translate-x-0 shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="navigation"
        aria-label="Ana navigasyon menüsü"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-[#183E93]">
          <div className="flex items-center gap-3">
            <div className="bg-turkcell-yellow rounded-lg p-2">
              <Shield className="w-6 h-6 text-[#183E93] font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TrustShield</h1>
              <p className="text-xs text-gray-200">Risk Management</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden hover:bg-white/10 p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#FFC500]" aria-label="Menüyü kapat">
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-2" aria-label="Ana menü">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              aria-label={`${item.label} sayfasına git`}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#FFC500] focus:ring-offset-2 focus:ring-offset-[#183E93] ${
                isActive
                  ? 'bg-[#FFC500] text-[#183E93] shadow-2xl scale-105 border-2 border-white'
                  : 'text-gray-100 hover:bg-white/15 hover:text-white'
              }`}
            >
              <item.icon className={`w-6 h-6`} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-[#183E93]/80">
          <div className="flex flex-col items-center justify-center gap-3">
            <img 
              src="/photo/TURKCELL_YATAY_DISI_LOGO.webp" 
              alt="Turkcell" 
              className="h-12 object-contain"
            />
            <div className="text-xs text-gray-300 text-center">
              <p>Turkcell TrustShield</p>
              <p className="mt-1">© 2026 All rights reserved</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
