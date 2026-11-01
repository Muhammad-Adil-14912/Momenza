import { Check, DollarSign, RefreshCw, Sparkles, Users, X } from 'lucide-react';
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

const DynamicReplanModal = ({
  isOpen,
  onClose,
  currentEventDetails,
  onPerformReplan,
  isReplanning
}) => {
  if (!isOpen) return null;

  const [budget, setBudget] = useState(currentEventDetails?.totalBudget || 800000);
  const [guests, setGuests] = useState(currentEventDetails?.guestCount || 300);
  const [date, setDate] = useState(currentEventDetails?.eventDate || '');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPerformReplan({
      totalBudget: Number(budget),
      guestCount: Number(guests),
      eventDate: date,
      replanNotes: notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#FAF9F6] p-6 border-b border-[#EAE8E2] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C47B62]/10 flex items-center justify-center text-[#C47B62]">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#252522]">Dynamic Event Replanning</h3>
              <p className="text-xs text-[#85847F]">Intelligently rebalance without starting over</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#85847F] hover:text-[#252522] rounded-full hover:bg-[#F1EDE5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] text-xs text-[#85847F] leading-relaxed">
            <p>
              Adjusting your budget or headcount will recalibrate your catering plates, decor scale, and vendor allocations while maintaining your core aesthetic and confirmed items.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
              Revised Total Budget (₹ INR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-[#85847F] font-semibold">₹</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                step="10000"
                min="50000"
                className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#252522]"
                required
              />
            </div>
            <p className="text-[11px] text-[#C47B62] mt-1 font-medium">
              Current: {formatCurrency(currentEventDetails?.totalBudget)} → New: {formatCurrency(budget)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                Guest Count
              </label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="10"
                max="5000"
                className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#252522]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-[#252522]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
              Specific Instructions (Optional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prioritize catering quality and reduce drone photography hours..."
              className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl p-3 text-xs text-[#252522] placeholder:text-[#85847F]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#85847F] hover:text-[#252522]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReplanning}
              className="px-5 py-2.5 bg-[#C47B62] hover:bg-[#A9614A] disabled:opacity-50 text-white text-xs font-medium rounded-full shadow-sm flex items-center space-x-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isReplanning ? 'Rebalancing with AI...' : 'Recalibrate Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicReplanModal;
