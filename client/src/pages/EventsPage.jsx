import {
    Calendar,
    ChevronRight,
    MapPin,
    Plus,
    Sparkles,
    Trash2,
    Users
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { formatCurrency, formatDate, formatLakh } from '../utils/formatters';

const EventsPage = () => {
  const navigate = useNavigate();
  const { events, activeEvent, selectEvent, deleteActiveEvent } = useEvents();

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this celebration and all its records?')) {
      await deleteActiveEvent(id);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
            Celebration Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
            My Celebrations
          </h1>
          <p className="text-sm text-[#85847F] mt-1 font-light">
            All your curated weddings, galas, and milestones in one serene workspace.
          </p>
        </div>

        <Link
          to="/planner"
          className="inline-flex items-center space-x-2 bg-[#252522] hover:bg-[#C47B62] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Celebration</span>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#EAE8E2] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-[#C47B62] mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h4 className="font-serif text-2xl text-[#252522]">No celebrations found</h4>
          <p className="text-sm text-[#85847F] max-w-sm mx-auto font-light">
            You haven't created any celebrations yet. Launch the AI Planner to build your first event.
          </p>
          <div className="pt-2">
            <Link
              to="/planner"
              className="inline-flex items-center space-x-2 bg-[#C47B62] text-white px-6 py-2.5 rounded-full text-xs font-medium"
            >
              Start Planning
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
                onClick={() => selectEvent(evt)}
                className={`rounded-3xl overflow-hidden bg-white border transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl ${
                  isActive ? 'border-[#C47B62] ring-1 ring-[#C47B62]' : 'border-[#EAE8E2] hover:border-[#85847F]'
                }`}
              >
                <div>
                  <div className="h-44 relative bg-[#FAF9F6] overflow-hidden">
                    <img src={img} alt={evt.eventName} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#252522]/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold bg-white/95 text-[#252522] px-2.5 py-1 rounded-full">
                      {evt.eventType}
                    </span>
                    {isActive && (
                      <span className="absolute top-3 right-3 text-[10px] font-medium bg-[#C47B62] text-white px-2.5 py-1 rounded-full">
                        Active Workspace
                      </span>
                    )}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-serif text-lg font-medium truncate">{evt.eventName}</h3>
                      <p className="text-xs text-white/80 flex items-center space-x-1 font-light">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{evt.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-[#EAE8E2] text-center">
                      <div>
                        <p className="text-[9px] uppercase text-[#85847F]">Date</p>
                        <p className="text-xs font-medium text-[#252522] mt-0.5">{formatDate(evt.eventDate)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase text-[#85847F]">Guests</p>
                        <p className="text-xs font-medium text-[#252522] mt-0.5">{evt.guestCount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase text-[#85847F]">Budget</p>
                        <p className="text-xs font-serif font-medium text-[#C47B62] mt-0.5">{formatLakh(evt.totalBudget)}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#85847F] line-clamp-2 font-light">
                      {evt.generatedPlan?.eventOverview?.conceptSummary || 'MOMENZA AI curated celebration plan.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#EAE8E2] mt-2 flex items-center justify-between">
                  <span className="text-xs text-[#C47B62] font-medium flex items-center space-x-1">
                    <span>Manage Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <button
                    onClick={(e) => handleDelete(evt._id || evt.id, e)}
                    className="p-1.5 text-[#85847F] hover:text-red-600 transition"
                    title="Delete event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
