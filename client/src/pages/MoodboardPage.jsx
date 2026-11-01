import {
    ArrowRight,
    Check,
    Heart,
    Image as ImageIcon,
    Layers,
    Palette,
    Plus,
    RefreshCw,
    Share2,
    Sparkles,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import FloatingConcierge from '../components/concierge/FloatingConcierge';
import { useEvents } from '../context/EventContext';
import api from '../services/api';

const MoodboardPage = ({ isEmbeddedInDashboard = false }) => {
  const { activeEvent, refreshActiveEventDetails } = useEvents();
  const [moodboards, setMoodboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [appliedMsg, setAppliedMsg] = useState('');
  const [activeBoard, setActiveBoard] = useState(null);
  const [similarIdeas, setSimilarIdeas] = useState(null);
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);

  const categories = [
    'All',
    'Minimal Wedding',
    'Royal Indian Wedding',
    'Garden Celebration',
    'Modern Birthday',
    'Luxury Anniversary',
    'Elegant Corporate Event'
  ];

  const fetchMoodboards = async () => {
    try {
      setLoading(true);
      const res = await api.get('/moodboards');
      if (res.data?.success) {
        setMoodboards(res.data.moodboards || []);
        if (res.data.moodboards?.length > 0) {
          setActiveBoard(res.data.moodboards[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching moodboards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodboards();
  }, []);

  const handleApplyToEvent = async (board) => {
    if (!activeEvent?._id) {
      alert('Please create or select an active celebration to apply this theme.');
      return;
    }

    try {
      const res = await api.post('/moodboards/apply', {
        eventId: activeEvent._id,
        moodboardId: board._id || board.id
      });

      if (res.data?.success) {
        setAppliedMsg(`Applied "${board.title}" theme and color palette to ${activeEvent.eventName}!`);
        await refreshActiveEventDetails();
        setTimeout(() => setAppliedMsg(''), 3000);
      }
    } catch (err) {
      alert('Failed to apply moodboard to event.');
    }
  };

  const handleGenerateSimilar = async (board) => {
    setIsGeneratingSimilar(true);
    try {
      const res = await api.post('/ai/regenerate-section', {
        sectionKey: 'themeRecommendations',
        eventDetails: {
          eventName: board.title,
          theme: board.title,
          specialRequirements: `Generate harmonious alternative palettes, rare botanicals, and bespoke lighting inspired by ${board.category}`
        }
      });

      if (res.data?.success && res.data.content) {
        setSimilarIdeas(res.data.content);
      }
    } catch (err) {
      alert('Could not generate similar ideas.');
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  const filteredBoards = selectedCategory === 'All'
    ? moodboards
    : moodboards.filter(m => m.category?.toLowerCase() === selectedCategory.toLowerCase());

  const content = (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
            Visual Inspiration & Scenography
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
            Find the feeling before the details.
          </h1>
          <p className="text-sm text-[#85847F] mt-1 font-light">
            Curated palettes, sculptural botanicals, and bespoke tablescapes for high-taste celebrations.
          </p>
        </div>

        {appliedMsg && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs px-4 py-2 rounded-full flex items-center space-x-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-green-600" />
            <span>{appliedMsg}</span>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-4 py-2 rounded-full border transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#252522] text-white border-[#252522]'
                : 'bg-white text-[#85847F] border-[#EAE8E2] hover:border-[#85847F]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Moodboard Editorial Grid */}
      <div className="space-y-16">
        {filteredBoards.map((board) => (
          <div
            key={board._id || board.id}
            className="bg-white rounded-3xl border border-[#EAE8E2] p-6 lg:p-8 space-y-6 hover:shadow-lg transition-all"
          >
            {/* Board Title & Top Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C47B62] bg-[#FAF9F6] border border-[#EAE8E2] px-2.5 py-1 rounded-full">
                  {board.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#252522] mt-2">
                  {board.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#85847F] font-light max-w-2xl mt-1 leading-relaxed">
                  {board.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleGenerateSimilar(board)}
                  disabled={isGeneratingSimilar}
                  className="text-xs font-medium bg-[#FAF9F6] hover:bg-[#F1EDE5] border border-[#EAE8E2] text-[#252522] px-3.5 py-2 rounded-full transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C47B62]" />
                  <span>Generate Variations</span>
                </button>

                <button
                  onClick={() => handleApplyToEvent(board)}
                  className="text-xs font-medium bg-[#252522] hover:bg-[#C47B62] text-white px-4 py-2 rounded-full transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Apply to My Event</span>
                </button>
              </div>
            </div>

            {/* Asymmetrical Photo Collage */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {(board.images || []).map((imgUrl, imgIdx) => (
                <div
                  key={imgIdx}
                  className={`relative rounded-2xl overflow-hidden bg-[#FAF9F6] aspect-4/5 group ${
                    imgIdx === 0 ? 'col-span-2 row-span-2 md:aspect-auto' : ''
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${board.title} inspiration ${imgIdx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>

            {/* Details Triad: Color Swatches, Floral Pairings, and Tablescape */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#EAE8E2]">
              {/* Color Swatches */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#85847F]">
                  Color Harmony Swatches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(board.colorPalette || []).map((hex, i) => (
                    <div key={i} className="flex items-center space-x-1.5 bg-[#FAF9F6] border border-[#EAE8E2] px-2.5 py-1 rounded-full">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: hex }} />
                      <span className="text-[11px] font-mono text-[#252522]">{hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floral Botanicals */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#85847F]">
                  Botanical & Floral Pairings
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(board.floralIdeas || []).map((fl, i) => (
                    <span key={i} className="text-[11px] bg-[#FAF9F6] border border-[#EAE8E2] px-2.5 py-1 rounded-full text-[#252522] font-light">
                      {fl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Table Setting & Ambience */}
              <div className="space-y-2.5">
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-[#85847F]">
                  Tablescape Concept
                </h4>
                <p className="text-xs text-[#85847F] font-light leading-relaxed">
                  {board.tableSetting || 'Refined natural linen runners, low floral groupings, and warm hurricane candle lanterns.'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Variations Modal */}
      {similarIdeas && (
        <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#FAF9F6] p-5 border-b border-[#EAE8E2] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C47B62]" />
                <h3 className="font-serif text-lg font-medium text-[#252522]">Generated Aesthetic Variations</h3>
              </div>
              <button onClick={() => setSimilarIdeas(null)} className="p-1 text-[#85847F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-2">
                <p className="font-serif text-base text-[#252522]">{similarIdeas.themeTitle}</p>
                <p className="text-xs text-[#85847F] font-light leading-relaxed">{similarIdeas.moodDescription}</p>
              </div>

              {similarIdeas.colorPalette && (
                <div>
                  <h4 className="text-xs font-semibold text-[#85847F] uppercase tracking-wider mb-2">Alternative Palette</h4>
                  <div className="flex flex-wrap gap-2">
                    {similarIdeas.colorPalette.map((col, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-[#FAF9F6] border border-[#EAE8E2] px-3 py-1.5 rounded-full">
                        <span className="w-4 h-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: col.hex }} />
                        <span className="text-xs text-[#252522]">{col.name}</span>
                        <span className="text-[10px] text-[#85847F]">{col.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similarIdeas.floralPalette && (
                <div>
                  <h4 className="text-xs font-semibold text-[#85847F] uppercase tracking-wider mb-2">Botanical Palette</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {similarIdeas.floralPalette.map((f, i) => (
                      <span key={i} className="text-xs bg-white border border-[#EAE8E2] px-2.5 py-1 rounded-full text-[#252522]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#FAF9F6] border-t border-[#EAE8E2] flex justify-end">
              <button
                onClick={() => setSimilarIdeas(null)}
                className="px-5 py-2 text-xs font-medium bg-[#252522] text-white rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isEmbeddedInDashboard) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252522]">
      <Navbar />
      <main className="py-8">{content}</main>
      <Footer />
      <FloatingConcierge />
    </div>
  );
};

export default MoodboardPage;
