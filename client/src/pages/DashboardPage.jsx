import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    CheckSquare,
    DollarSign,
    HeartHandshake,
    Layers,
    MapPin,
    Plus,
    Sparkles,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { formatCurrency, formatDate, formatLakh } from '../utils/formatters';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, activeEvent, selectEvent, tasks, expenses } = useEvents();

  // Metrics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => new Date(e.eventDate) >= new Date()).length;
  const totalPlannedBudget = events.reduce((sum, e) => sum + (Number(e.totalBudget) || 0), 0);
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  const quickActionCards = [
    { title: 'Plan a Wedding', type: 'Wedding', icon: Sparkles, desc: 'Royal & minimal ceremonies' },
    { title: 'Plan a Birthday', type: 'Birthday', icon: Calendar, desc: 'Milestones & intimate dinners' },
    { title: 'Corporate Gala', type: 'Corporate Event', icon: TrendingUp, desc: 'Conferences & leadership summits' },
    { title: 'Ask MOMENZA', type: 'Concierge', icon: Sparkles, desc: '24/7 AI event consulting' }
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-8">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
            Host Overview
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
            Every great celebration starts with an idea.
          </h1>
          <p className="text-sm text-[#85847F] mt-1 font-light">
            Welcome back, {user?.name || 'Aria'}. Your celebrations, thoughtfully organized.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/planner"
            className="inline-flex items-center space-x-2 bg-[#C47B62] hover:bg-[#A9614A] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">
              Total Celebrations
            </span>
            <Layers className="w-4 h-4 text-[#C47B62]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-medium text-[#252522]">
            {totalEvents}
          </p>
          <p className="text-[11px] text-[#85847F] font-light">Curated in your portfolio</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">
              Upcoming Events
            </span>
            <Calendar className="w-4 h-4 text-[#A7B29A]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-medium text-[#252522]">
            {upcomingEvents}
          </p>
          <p className="text-[11px] text-[#A7B29A] font-medium">On schedule</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">
              Total Planned Budget
            </span>
            <DollarSign className="w-4 h-4 text-[#C47B62]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-medium text-[#252522]">
            {formatLakh(totalPlannedBudget)}
          </p>
          <p className="text-[11px] text-[#85847F] font-light">Across all active plans</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">
              Pending Tasks
            </span>
            <CheckSquare className="w-4 h-4 text-[#85847F]" />
          </div>
          <p className="font-serif text-2xl sm:text-3xl font-medium text-[#252522]">
            {pendingTasksCount}
          </p>
          <p className="text-[11px] text-[#85847F] font-light">Action milestones</p>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#85847F]">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActionCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (card.type === 'Concierge') {
                    // Triggers concierge
                    const btn = document.querySelector('[aria-label="Open MOMENZA Concierge"]');
                    if (btn) btn.click();
                  } else {
                    navigate(`/planner?type=${encodeURIComponent(card.type)}`);
                  }
                }}
                className="p-4 rounded-2xl bg-white border border-[#EAE8E2] hover:border-[#C47B62] text-left transition-all hover:shadow-xs group space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-[#C47B62] group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#252522]">{card.title}</p>
                  <p className="text-[11px] text-[#85847F] font-light line-clamp-1">{card.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upcoming Celebrations Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl text-[#252522]">Upcoming Celebrations</h3>
          {events.length > 0 && (
            <Link to="/dashboard/events" className="text-xs text-[#C47B62] hover:underline flex items-center space-x-1">
              <span>View all ({events.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {events.length === 0 ? (
          /* Beautiful Empty State */
          <div className="p-12 rounded-3xl bg-white border border-[#EAE8E2] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-[#C47B62] mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl text-[#252522]">No celebrations yet</h4>
            <p className="text-sm text-[#85847F] max-w-md mx-auto font-light">
              Start by describing your celebration. MOMENZA will generate an editable plan with budget breakdowns, timelines, and tailored vendors.
            </p>
            <div className="pt-2">
              <Link
                to="/planner"
                className="inline-flex items-center space-x-2 bg-[#252522] hover:bg-[#C47B62] text-white px-6 py-3 rounded-full text-xs font-medium transition"
              >
                <Sparkles className="w-4 h-4 text-[#F1EDE5]" />
                <span>Create Your First Celebration</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => {
              const isActive = activeEvent?._id === evt._id;
              const img =
                evt.eventType === 'Wedding'
                  ? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'
                  : evt.eventType === 'Birthday'
                  ? 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={evt._id || evt.id}
                  className={`rounded-3xl overflow-hidden bg-white border transition-all duration-300 hover:shadow-xl flex flex-col ${
                    isActive ? 'border-[#C47B62] ring-1 ring-[#C47B62]' : 'border-[#EAE8E2]'
                  }`}
                >
                  <div className="h-44 relative overflow-hidden bg-[#FAF9F6]">
                    <img src={img} alt={evt.eventName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#252522]/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-semibold bg-white/90 backdrop-blur-xs text-[#252522] px-2.5 py-1 rounded-full">
                      {evt.eventType}
                    </span>
                    {isActive && (
                      <span className="absolute top-4 right-4 text-[10px] font-medium bg-[#C47B62] text-white px-2.5 py-1 rounded-full">
                        Active Workspace
                      </span>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="font-serif text-lg font-medium truncate">{evt.eventName}</h4>
                      <p className="text-xs text-white/80 flex items-center space-x-1 font-light">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{evt.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-3 gap-2 py-1 text-center border-b border-[#EAE8E2]">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#85847F]">Date</p>
                        <p className="text-xs font-medium text-[#252522] mt-0.5">{formatDate(evt.eventDate)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#85847F]">Guests</p>
                        <p className="text-xs font-medium text-[#252522] mt-0.5">{evt.guestCount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-[#85847F]">Budget</p>
                        <p className="text-xs font-serif font-medium text-[#C47B62] mt-0.5">{formatLakh(evt.totalBudget)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => selectEvent(evt)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                          isActive
                            ? 'bg-[#FAF9F6] text-[#C47B62] border border-[#EAE8E2]'
                            : 'bg-[#252522] text-white hover:bg-[#C47B62]'
                        }`}
                      >
                        {isActive ? 'Currently Active' : 'Switch to this event'}
                      </button>
                      <Link
                        to="/planner"
                        className="p-2 border border-[#EAE8E2] rounded-xl hover:bg-[#FAF9F6] text-[#85847F] hover:text-[#252522]"
                        title="View Full AI Plan"
                      >
                        <Sparkles className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
