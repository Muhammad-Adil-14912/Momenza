import {
    Calendar,
    CheckSquare,
    ChevronDown,
    DollarSign,
    HeartHandshake,
    Image,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    Plus,
    Settings,
    Sparkles,
    Users,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import FloatingConcierge from '../concierge/FloatingConcierge';
import Logo from '../common/Logo';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { events, activeEvent, selectEvent } = useEvents();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Celebrations', path: '/dashboard/events', icon: Layers },
    { name: 'AI Planner', path: '/planner', icon: Sparkles },
    { name: 'Budget & Expenses', path: '/dashboard/budget', icon: DollarSign },
    { name: 'Timeline & Tasks', path: '/dashboard/timeline', icon: CheckSquare },
    { name: 'Guests', path: '/dashboard/guests', icon: Users },
    { name: 'Vendors', path: '/dashboard/vendors', icon: HeartHandshake },
    { name: 'Inspiration', path: '/dashboard/moodboards', icon: Image },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#FFFFFF] border-r border-[#EAE8E2] shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#EAE8E2]">
          <Logo />
        </div>

        {/* Active Celebration Selector */}
        <div className="p-4 border-b border-[#EAE8E2] relative">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
            Active Celebration
          </label>
          <button
            onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
            className="w-full flex items-center justify-between bg-[#FAF9F6] border border-[#EAE8E2] hover:border-[#C47B62] rounded-xl px-3 py-2 text-left transition-colors"
          >
            <div className="truncate pr-2">
              <p className="text-xs font-semibold text-[#252522] truncate">
                {activeEvent ? activeEvent.eventName : 'No active event'}
              </p>
              <p className="text-[10px] text-[#85847F] truncate">
                {activeEvent ? `${activeEvent.eventType} • ${activeEvent.location}` : 'Create your first event'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#85847F] shrink-0" />
          </button>

          {/* Dropdown Menu */}
          {eventDropdownOpen && (
            <div className="absolute left-4 right-4 top-20 bg-white border border-[#EAE8E2] rounded-xl shadow-xl z-50 py-1 max-h-60 overflow-y-auto">
              {events.map((evt) => (
                <button
                  key={evt._id || evt.id}
                  onClick={() => {
                    selectEvent(evt);
                    setEventDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAF9F6] transition ${
                    activeEvent?._id === evt._id ? 'text-[#C47B62] font-semibold bg-[#F7EFEA]' : 'text-[#252522]'
                  }`}
                >
                  <span className="truncate">{evt.eventName}</span>
                  <span className="text-[10px] text-[#85847F]">{evt.eventType}</span>
                </button>
              ))}
              <div className="border-t border-[#EAE8E2] mt-1 pt-1">
                <Link
                  to="/planner"
                  onClick={() => setEventDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 text-xs text-[#C47B62] font-medium flex items-center space-x-1.5 hover:bg-[#F7EFEA]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Plan New Celebration</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#252522] text-white shadow-xs'
                    : 'text-[#85847F] hover:text-[#252522] hover:bg-[#FAF9F6]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF9F6]' : 'text-[#85847F]'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-[#EAE8E2] flex items-center justify-between bg-[#FAF9F6]/40">
          <div className="flex items-center space-x-2.5 min-w-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-[#EAE8E2]"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-[#252522] truncate">{user?.name || 'Host'}</p>
              <p className="text-[10px] text-[#85847F] truncate">{user?.email || 'demo@momenza.art'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-[#85847F] hover:text-[#C47B62] hover:bg-[#F1EDE5] rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#EAE8E2] z-40 px-4 flex items-center justify-between">
        <Logo size="small" />
        <div className="flex items-center space-x-2">
          <Link
            to="/planner"
            className="text-xs bg-[#C47B62] text-white px-3 py-1.5 rounded-full flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Plan</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-[#252522]"
            aria-label="Open Navigation"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#252522]/40 backdrop-blur-xs flex">
          <div className="w-64 bg-white h-full flex flex-col p-4 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#EAE8E2]">
              <Logo size="small" />
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-[#85847F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                      isActive ? 'bg-[#252522] text-white' : 'text-[#85847F] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="pt-3 border-t border-[#EAE8E2] flex items-center justify-between">
              <span className="text-xs text-[#252522] font-medium">{user?.name}</span>
              <button onClick={logout} className="text-xs text-[#C47B62] hover:underline">
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0 overflow-y-auto">
        <Outlet />
      </main>

      {/* Global Concierge available across dashboard */}
      <FloatingConcierge />
    </div>
  );
};

export default DashboardLayout;
