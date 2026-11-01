import {
    AlertTriangle,
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Clock,
    DollarSign,
    Download,
    Edit3,
    HeartHandshake,
    History,
    Layers,
    Palette,
    RefreshCw,
    Save,
    Sparkles,
    Utensils,
    Wind
} from 'lucide-react';
import React, { useState } from 'react';
import { formatCurrency, formatDate, formatLakh } from '../../utils/formatters';
import { exportPlanToPDF } from '../../utils/pdfGenerator';

const PlanPreviewTabs = ({
  plan,
  eventDetails,
  onRegenerateSection,
  onSaveToEvents,
  onOpenReplanModal,
  onOpenVersionModal,
  isSaving = false,
  isRegeneratingSection = false,
  activeVersion = 1,
  totalVersions = 1
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [editingSection, setEditingSection] = useState(null);

  if (!plan || Object.keys(plan).length === 0) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#EAE8E2]">
        <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-[#C47B62] mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl text-[#252522]">Your Live Event Plan</h3>
        <p className="text-sm text-[#85847F] max-w-sm mt-2 font-light">
          Fill in your celebration vision on the left panel and click "Generate My Event Plan" to preview your curated roadmap.
        </p>
      </div>
    );
  }

  const {
    eventOverview = {},
    budgetBreakdown = [],
    preparationTimeline = [],
    vendorRequirements = [],
    themeRecommendations = {},
    decorationIdeas = {},
    cateringSuggestions = {},
    guestManagementSuggestions = {},
    entertainmentIdeas = {},
    riskAndContingencyPlanning = {}
  } = plan;

  const totalAllocated = budgetBreakdown.reduce((sum, b) => sum + (b.allocatedAmount || 0), 0);
  const totalBudget = Number(eventDetails?.totalBudget) || totalAllocated || 800000;
  const remainingBudget = totalBudget - totalAllocated;

  const handlePDFExport = async () => {
    setIsExportingPDF(true);
    try {
      await exportPlanToPDF('momenza-event-plan-export', `${eventDetails?.eventName || 'Momenza'}_Plan.pdf`);
    } catch (err) {
      alert('Could not export PDF. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'decor', label: 'Scenography', icon: Palette },
    { id: 'catering', label: 'Catering', icon: Utensils },
    { id: 'vendors', label: 'Vendors', icon: HeartHandshake },
    { id: 'risk', label: 'Contingency', icon: ShieldIcon }
  ];

  function ShieldIcon(props) {
    return <AlertTriangle {...props} />;
  }

  return (
    <div className="bg-white rounded-3xl border border-[#EAE8E2] overflow-hidden shadow-xs flex flex-col h-full">
      {/* Top Action Header */}
      <div className="p-4 sm:p-6 bg-[#FAF9F6] border-b border-[#EAE8E2] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#C47B62]/10 flex items-center justify-center text-[#C47B62]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif text-lg font-medium text-[#252522]">
                {eventOverview.title || eventDetails?.eventName || 'Curated Celebration'}
              </h2>
              <span className="text-[10px] bg-white border border-[#EAE8E2] px-2 py-0.5 rounded-full text-[#85847F]">
                v{activeVersion}
              </span>
            </div>
            <p className="text-xs text-[#85847F]">
              {eventDetails?.eventType || 'Celebration'} • {eventDetails?.location} • {eventDetails?.guestCount} Guests
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {totalVersions > 1 && (
            <button
              onClick={onOpenVersionModal}
              title="Version History"
              className="p-2 bg-white hover:bg-[#F1EDE5] border border-[#EAE8E2] rounded-full text-[#85847F] hover:text-[#252522] transition"
            >
              <History className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenReplanModal}
            className="text-xs font-medium bg-white hover:bg-[#F1EDE5] border border-[#EAE8E2] text-[#252522] px-3.5 py-2 rounded-full transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C47B62]" />
            <span>Dynamic Replan</span>
          </button>

          <button
            onClick={handlePDFExport}
            disabled={isExportingPDF}
            className="text-xs font-medium bg-white hover:bg-[#F1EDE5] border border-[#EAE8E2] text-[#252522] px-3.5 py-2 rounded-full transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPDF ? 'Generating...' : 'Export PDF'}</span>
          </button>

          <button
            onClick={onSaveToEvents}
            disabled={isSaving}
            className="text-xs font-medium bg-[#252522] hover:bg-[#C47B62] text-white px-4 py-2 rounded-full transition flex items-center space-x-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Plan'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-[#FAF9F6]/50 border-b border-[#EAE8E2] px-4 overflow-x-auto no-scrollbar flex space-x-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-[#C47B62] text-[#C47B62]'
                  : 'border-transparent text-[#85847F] hover:text-[#252522]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Exportable Plan Container */}
      <div id="momenza-event-plan-export" className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Concept Summary Card */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-3">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C47B62]">
                Concept & Creative Direction
              </span>
              <p className="font-serif text-xl sm:text-2xl text-[#252522] font-normal leading-snug">
                "{eventOverview.tagline || 'Where heritage charm meets contemporary elegance.'}"
              </p>
              <p className="text-xs sm:text-sm text-[#85847F] font-light leading-relaxed">
                {eventOverview.conceptSummary}
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-white border border-[#EAE8E2]">
                <p className="text-[10px] text-[#85847F] uppercase tracking-wider">Total Budget</p>
                <p className="font-serif text-lg text-[#252522] mt-1">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#EAE8E2]">
                <p className="text-[10px] text-[#85847F] uppercase tracking-wider">Allocated</p>
                <p className="font-serif text-lg text-[#C47B62] mt-1">{formatCurrency(totalAllocated)}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#EAE8E2]">
                <p className="text-[10px] text-[#85847F] uppercase tracking-wider">Estimated / Guest</p>
                <p className="font-serif text-lg text-[#252522] mt-1">
                  {formatCurrency(eventOverview.estimatedPerGuestCost || Math.round(totalBudget / (eventDetails?.guestCount || 300)))}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#EAE8E2]">
                <p className="text-[10px] text-[#85847F] uppercase tracking-wider">Target Date</p>
                <p className="font-serif text-sm sm:text-base text-[#252522] mt-1">
                  {formatDate(eventDetails?.eventDate)}
                </p>
              </div>
            </div>

            {/* Signature Highlights */}
            {eventOverview.keyHighlights && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#85847F]">
                  Signature Event Pillars
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {eventOverview.keyHighlights.map((hl, i) => (
                    <div key={i} className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2]">
                      <CheckCircle2 className="w-4 h-4 text-[#A7B29A] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#252522] font-light leading-relaxed">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: BUDGET BREAKDOWN */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-[#252522]">Strategic Financial Allocation</h3>
                <p className="text-xs text-[#85847F]">
                  Optimized for {eventDetails?.guestCount} guests in {eventDetails?.location}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#85847F]">Contingency Reserve:</span>
                <span className="text-sm font-semibold text-[#A7B29A] ml-1.5">
                  {formatCurrency(Math.max(remainingBudget, Math.round(totalBudget * 0.05)))}
                </span>
              </div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {budgetBreakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#252522]">{item.category}</span>
                    <span className="text-xs font-serif text-[#C47B62] font-medium">
                      {formatCurrency(item.allocatedAmount)}
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF9F6] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C47B62] h-full rounded-full"
                      style={{ width: `${Math.min(item.percentage || 15, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#85847F] font-light line-clamp-2">
                    {item.strategicRationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PREPARATION TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#252522]">Chronological Roadmap</h3>
              <span className="text-xs text-[#85847F]">Milestones leading to celebration day</span>
            </div>

            <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EAE8E2]">
              {preparationTimeline.map((phaseObj, pIdx) => (
                <div key={pIdx} className="relative pl-9 space-y-3">
                  <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-[#C47B62] border-2 border-white ring-2 ring-[#EAE8E2]" />
                  <div className="flex items-center space-x-2">
                    <h4 className="font-serif text-base text-[#252522] font-medium">
                      {phaseObj.phase}
                    </h4>
                    {phaseObj.timeframe && (
                      <span className="text-[10px] bg-[#FAF9F6] border border-[#EAE8E2] px-2 py-0.5 rounded-full text-[#85847F]">
                        {phaseObj.timeframe}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {(phaseObj.tasks || []).map((t, tIdx) => (
                      <div key={tIdx} className="p-3 rounded-xl bg-white border border-[#EAE8E2] flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-[#252522]">{t.title}</p>
                          {t.tips && <p className="text-[11px] text-[#85847F] font-light">{t.tips}</p>}
                        </div>
                        <span
                          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 font-medium ${
                            t.priority === 'high'
                              ? 'bg-[#C47B62]/10 text-[#C47B62]'
                              : 'bg-[#A7B29A]/15 text-[#879478]'
                          }`}
                        >
                          {t.priority || 'medium'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SCENOGRAPHY & DECOR */}
        {activeTab === 'decor' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-3">
              <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C47B62]">
                Visual Mood & Narrative
              </span>
              <h4 className="font-serif text-xl text-[#252522]">
                {themeRecommendations.themeTitle || 'Curated Editorial Palette'}
              </h4>
              <p className="text-xs sm:text-sm text-[#85847F] font-light leading-relaxed">
                {themeRecommendations.moodDescription}
              </p>

              {/* Color Swatches */}
              {themeRecommendations.colorPalette && (
                <div className="pt-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#85847F] mb-2 font-semibold">
                    Curated Color Swatches
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {themeRecommendations.colorPalette.map((col, cIdx) => (
                      <div key={cIdx} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full border border-[#EAE8E2]">
                        <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: col.hex }} />
                        <span className="text-xs text-[#252522] font-medium">{col.name}</span>
                        <span className="text-[10px] text-[#85847F]">{col.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Floral & Lighting Blueprint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#85847F]">Floral Story</h5>
                <div className="flex flex-wrap gap-1.5">
                  {(themeRecommendations.floralPalette || []).map((fl, fIdx) => (
                    <span key={fIdx} className="text-xs bg-[#FAF9F6] border border-[#EAE8E2] px-2.5 py-1 rounded-full text-[#252522]">
                      {fl}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-[#85847F]">Lighting Architecture</h5>
                <p className="text-xs text-[#252522] font-light leading-relaxed">
                  {themeRecommendations.lightingConcept}
                </p>
              </div>
            </div>

            {/* Zone Scenography */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-[#85847F]">Spatial Experiences</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2]">
                  <p className="text-xs font-medium text-[#252522]">Grand Entrance</p>
                  <p className="text-xs text-[#85847F] mt-1 font-light leading-relaxed">{decorationIdeas.entrance}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2]">
                  <p className="text-xs font-medium text-[#252522]">Main Stage & Focal Vignette</p>
                  <p className="text-xs text-[#85847F] mt-1 font-light leading-relaxed">{decorationIdeas.stageOrFocalPoint}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2]">
                  <p className="text-xs font-medium text-[#252522]">Banquet Tablescape</p>
                  <p className="text-xs text-[#85847F] mt-1 font-light leading-relaxed">{decorationIdeas.diningArea}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2]">
                  <p className="text-xs font-medium text-[#252522]">Photo Memories Vignette</p>
                  <p className="text-xs text-[#85847F] mt-1 font-light leading-relaxed">{decorationIdeas.photoOpportunity}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CATERING & GASTRONOMY */}
        {activeTab === 'catering' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-[#252522]">Curated Tasting Menu</h3>
                <p className="text-xs text-[#85847F]">Tailored for {eventDetails?.foodPreferences || 'banquet excellence'}</p>
              </div>
              <button
                onClick={() => onRegenerateSection('cateringSuggestions')}
                disabled={isRegeneratingSection}
                className="text-xs text-[#C47B62] hover:underline flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${isRegeneratingSection ? 'animate-spin' : ''}`} />
                <span>Regenerate Menu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#C47B62]">Welcome Sips</span>
                <ul className="space-y-1.5 text-xs text-[#252522] font-light">
                  {(cateringSuggestions.welcomeDrinks || []).map((d, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-[#C47B62]" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#C47B62]">Live Canapés</span>
                <ul className="space-y-1.5 text-xs text-[#252522] font-light">
                  {(cateringSuggestions.appetizers || []).map((a, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-[#C47B62]" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#C47B62]">Hero Banquet Courses</span>
                <ul className="space-y-1.5 text-xs text-[#252522] font-light">
                  {(cateringSuggestions.mainCourses || []).map((m, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-[#C47B62]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                <span className="text-[10px] uppercase font-semibold text-[#C47B62]">Artisanal Confections</span>
                <ul className="space-y-1.5 text-xs text-[#252522] font-light">
                  {(cateringSuggestions.desserts || []).map((ds, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1 h-1 rounded-full bg-[#C47B62]" />
                      <span>{ds}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-1 text-xs">
              <p className="font-semibold text-[#252522]">Presentation & Dietary Protocol</p>
              <p className="text-[#85847F] font-light leading-relaxed">
                {cateringSuggestions.presentationStyle} — {cateringSuggestions.dietaryHandling}
              </p>
            </div>
          </div>
        )}

        {/* TAB: VENDORS */}
        {activeTab === 'vendors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#252522]">Vendor Requirements</h3>
              <span className="text-xs text-[#85847F]">Staffing & contractor allocations</span>
            </div>

            <div className="space-y-3">
              {vendorRequirements.map((v, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-[#EAE8E2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold text-[#252522]">{v.category}</p>
                      <span className="text-[10px] bg-[#FAF9F6] border border-[#EAE8E2] px-2 py-0.5 rounded-full text-[#85847F]">
                        {v.count} Required
                      </span>
                    </div>
                    <p className="text-xs text-[#85847F] mt-1 font-light">{v.keyRequirements}</p>
                  </div>
                  <div className="text-right sm:shrink-0">
                    <span className="text-xs text-[#85847F]">Est. Cost: </span>
                    <span className="text-sm font-serif font-medium text-[#C47B62]">
                      {formatCurrency(v.estimatedCost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: RISK & CONTINGENCY */}
        {activeTab === 'risk' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-[#252522]">Event Risk & Contingency Planning</h3>
                <p className="text-xs text-[#85847F]">Proactive safeguards for stress-free hosting</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(riskAndContingencyPlanning).map(([key, item], idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white border border-[#EAE8E2] space-y-2">
                  <div className="flex items-center space-x-2 text-[#C47B62]">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider capitalize text-[#252522]">
                      {key.replace('Risk', '')} Mitigation
                    </span>
                  </div>
                  <p className="text-xs text-[#85847F] font-medium">Scenario: {item.risk}</p>
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2] text-xs text-[#252522] font-light leading-relaxed">
                    <span className="font-semibold text-[#A7B29A]">Contingency Action: </span>
                    {item.contingencyPlan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanPreviewTabs;
