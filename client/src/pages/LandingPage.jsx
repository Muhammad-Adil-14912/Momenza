import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    HeartHandshake,
    Image as ImageIcon,
    ShieldAlert,
    Sparkles,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';
import FloatingConcierge from '../components/concierge/FloatingConcierge';

// Hero slideshow images — reliable Unsplash CDN URLs
const heroSlides = [
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=85',
    label: 'Weddings',
    caption: 'Timeless unions & grand heritage rites',
  },
  {
    src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&auto=format&fit=crop&q=85',
    label: 'Birthdays',
    caption: 'Milestone moments with flair',
  },
  {
    src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=85',
    label: 'Parties & Festivals',
    caption: 'Vibrant energy & artistic showcases',
  },
  {
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=85',
    label: 'Anniversaries',
    caption: 'Quiet luxury & enduring devotion',
  },
  {
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=85',
    label: 'Corporate Events',
    caption: 'High-impact summits & executive galas',
  },
  {
    src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=85',
    label: 'Community Celebrations',
    caption: 'Cultural togetherness & neighbourhood feasts',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Auto-advance every 5 s with a cross-fade
  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSlideIndex((i) => (i + 1) % heroSlides.length);
        setFading(false);
      }, 600); // fade-out duration
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const celebrationCategories = [
    {
      title: 'Weddings',
      tagline: 'Timeless unions & grand heritage rites',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
      description: 'From intimate courtyards to royal palaces, harmonize every ritual, floral canopy, and guest detail effortlessly.',
      eventType: 'Wedding',
      colSpan: 'md:col-span-8'
    },
    {
      title: 'Birthdays',
      tagline: 'Milestone moments with flair',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80',
      description: 'Chic rooftop gatherings, ambient dinner parties, and unforgettable themed celebrations.',
      eventType: 'Birthday',
      colSpan: 'md:col-span-4'
    },
    {
      title: 'Anniversaries',
      tagline: 'Quiet luxury & enduring devotion',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
      description: 'Candlelit banquets, curated vintage acoustic sets, and bespoke culinary journeys.',
      eventType: 'Anniversary',
      colSpan: 'md:col-span-4'
    },
    {
      title: 'Corporate Events',
      tagline: 'High-impact summits & executive galas',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
      description: 'Architectural staging, seamless audio-visual coordination, and elevated networking environments.',
      eventType: 'Corporate Event',
      colSpan: 'md:col-span-8'
    },
    {
      title: 'College Festivals',
      tagline: 'Vibrant youth energy & artistic showcases',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      description: 'Stage lighting, multi-track schedules, sponsor coordination, and artist hospitality management.',
      eventType: 'College Festival',
      colSpan: 'md:col-span-6'
    },
    {
      title: 'Community Celebrations',
      tagline: 'Cultural togetherness & neighborhood feasts',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&auto=format&fit=crop&q=80',
      description: 'Festivals of light, seasonal harvests, and communal banquets planned with welcoming warmth.',
      eventType: 'Community Celebration',
      colSpan: 'md:col-span-6'
    }
  ];

  const features = [
    {
      title: 'AI Event Planning',
      desc: 'Describe your vision in natural language. Receive a validated 10-point roadmap in seconds.',
      icon: Sparkles,
      tag: 'Core Intelligence'
    },
    {
      title: 'Smart Budget Optimization',
      desc: 'Live allocation tracking with AI recommendations that find realistic savings without sacrificing quality.',
      icon: DollarSign,
      tag: 'Financial Precision'
    },
    {
      title: 'Personalized Moodboards',
      desc: 'Harmonious color palettes, botanical pairings, and table setting aesthetics curated for your theme.',
      icon: ImageIcon,
      tag: 'Visual Direction'
    },
    {
      title: 'Vendor Discovery',
      desc: 'Hand-vetted venues, caterers, photographers, and decorators with real pricing and direct booking status.',
      icon: HeartHandshake,
      tag: 'Verified Partners'
    },
    {
      title: 'Automated Timelines',
      desc: 'Milestone checklists starting 3 months out down to the exact hour of your celebration day.',
      icon: Clock,
      tag: 'Zero Stress'
    },
    {
      title: 'Guest Management',
      desc: 'Track RSVPs, dietary allergies, and table numbers with effortless CSV import and export.',
      icon: Users,
      tag: 'Effortless Hospitality'
    }
  ];

  const handleCategoryClick = (eventType) => {
    navigate(`/planner?type=${encodeURIComponent(eventType)}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#252522] selection:bg-[#C47B62]/20 selection:text-[#252522]">
      <Navbar />

      {/* Hero Section – Asymmetric Split Layout with Editorial Photography */}
      <section className="relative pt-10 pb-20 lg:pt-20 lg:pb-32 overflow-hidden border-b border-[#EAE8E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Text Column */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F1EDE5] border border-[#EAE8E2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C47B62]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#85847F]">
                  The Art of Celebrating
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#252522] leading-[1.12] tracking-tight font-normal">
                Some moments deserve <br className="hidden sm:inline" />
                <span className="italic font-serif text-[#C47B62]">more than just a plan.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#85847F] max-w-xl font-light leading-relaxed">
                From intimate gatherings to grand celebrations, MOMENZA brings your ideas, budget, and every little detail together into quiet luxury.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/planner"
                  className="inline-flex items-center justify-center space-x-2.5 bg-[#252522] hover:bg-[#C47B62] text-white px-8 py-4 rounded-full text-sm font-medium transition duration-300 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#F1EDE5]" />
                  <span>Plan Your Event</span>
                </Link>

                <a
                  href="#discover"
                  className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#F1EDE5] border border-[#EAE8E2] text-[#252522] px-8 py-4 rounded-full text-sm font-medium transition duration-300"
                >
                  <span>Explore Celebrations</span>
                  <ArrowRight className="w-4 h-4 text-[#85847F]" />
                </a>
              </div>

              {/* Trust Metric Counters */}
              <div className="pt-8 border-t border-[#EAE8E2] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <p className="font-serif text-2xl font-medium text-[#252522]">100%</p>
                  <p className="text-xs text-[#85847F] mt-0.5">Bespoke Curation</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-medium text-[#252522]">₹0 Overrun</p>
                  <p className="text-xs text-[#85847F] mt-0.5">Smart Optimization</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-medium text-[#252522]">24/7</p>
                  <p className="text-xs text-[#85847F] mt-0.5">AI Concierge</p>
                </div>
              </div>
            </div>

            {/* Right Visual Column – Hero Image Slideshow */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card with crossfade slideshow */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#EAE8E2] aspect-4/5 bg-[#F1EDE5]">
                  <img
                    key={slideIndex}
                    src={heroSlides[slideIndex].src}
                    alt={heroSlides[slideIndex].label}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    style={{
                      opacity: fading ? 0 : 1,
                      transition: 'opacity 0.6s ease-in-out',
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://picsum.photos/seed/momenza-${slideIndex}/800/1000`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#252522]/70 via-transparent to-transparent" />

                  {/* Slide label at bottom */}
                  <div
                    className="absolute bottom-6 left-6 right-6 text-white p-4 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20"
                    style={{
                      opacity: fading ? 0 : 1,
                      transition: 'opacity 0.6s ease-in-out',
                    }}
                  >
                    <p className="text-[11px] tracking-widest uppercase text-white/70 font-medium">
                      {heroSlides[slideIndex].label}
                    </p>
                    <p className="font-serif text-base text-white font-medium mt-0.5">
                      {heroSlides[slideIndex].caption}
                    </p>
                  </div>

                  {/* Dot indicators */}
                  <div className="absolute top-4 right-4 flex space-x-1.5">
                    {heroSlides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setFading(true); setTimeout(() => { setSlideIndex(i); setFading(false); }, 300); }}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i === slideIndex ? 'bg-white w-4' : 'bg-white/40'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Discovery Section – Asymmetric Photography Grid */}
      <section id="discover" className="py-24 bg-[#FAF9F6] border-b border-[#EAE8E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#85847F]">
              Curation & Inspiration
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-2 font-normal">
              Find your kind of celebration.
            </h2>
            <p className="text-sm sm:text-base text-[#85847F] mt-3 font-light">
              Select an archetype to launch your personalized AI concierge with tailored aesthetics, menus, and timelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {celebrationCategories.map((cat, idx) => (
              <div
                key={cat.title}
                onClick={() => handleCategoryClick(cat.eventType)}
                className={`${cat.colSpan} group relative rounded-3xl overflow-hidden cursor-pointer border border-[#EAE8E2] bg-white h-[380px] transition-all duration-500 hover:shadow-2xl hover:border-[#C47B62] flex flex-col justify-end p-8`}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://picsum.photos/seed/momenza-${cat.title}/800/600`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#252522]/90 via-[#252522]/30 to-transparent transition-opacity group-hover:from-[#252522]/95" />

                <div className="relative z-10 space-y-2 text-white">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-[#C47B62] bg-[#FAF9F6]/90 px-2.5 py-1 rounded-full text-black">
                    {cat.tagline}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white group-hover:text-[#F1EDE5] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-light line-clamp-2 max-w-md">
                    {cat.description}
                  </p>
                  <div className="pt-2 flex items-center space-x-2 text-xs font-medium text-[#C47B62] group-hover:translate-x-1 transition-transform">
                    <span>Plan with AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-[#FFFFFF] border-b border-[#EAE8E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#85847F]">
              The Momenza Workflow
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252522] font-normal">
              Beautifully simple. Thoughtfully planned.
            </h2>
            <p className="text-sm sm:text-base text-[#85847F] font-light">
              We replace spreadsheet chaos with an intelligent editorial workspace that takes you from spark to reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-5 relative">
              <span className="font-serif text-4xl text-[#C47B62]/40 font-medium">01</span>
              <h3 className="font-serif text-xl text-[#252522]">Share Your Vision</h3>
              <p className="text-xs sm:text-sm text-[#85847F] leading-relaxed font-light">
                Tell us about your celebration in plain words—from "a ₹8 Lakh royal wedding in Lucknow for 300 guests" to an intimate rooftop anniversary dinner.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-5 relative">
              <span className="font-serif text-4xl text-[#C47B62]/40 font-medium">02</span>
              <h3 className="font-serif text-xl text-[#252522]">Meet Your AI Planner</h3>
              <p className="text-xs sm:text-sm text-[#85847F] leading-relaxed font-light">
                Receive an instant live preview with financial category breakdowns, multi-month milestone timelines, curated caterers, and floral palettes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-5 relative">
              <span className="font-serif text-4xl text-[#C47B62]/40 font-medium">03</span>
              <h3 className="font-serif text-xl text-[#252522]">Enjoy Every Moment</h3>
              <p className="text-xs sm:text-sm text-[#85847F] leading-relaxed font-light">
                Track RSVPs, optimize expenses, consult your 24/7 AI Concierge for last-minute adjustments, and download your master PDF itinerary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Features Grid */}
      <section className="py-24 bg-[#FAF9F6] border-b border-[#EAE8E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-2">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#85847F]">
              Crafted Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#252522] font-normal">
              Designed for celebrations that matter.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white p-8 rounded-3xl border border-[#EAE8E2] hover:border-[#C47B62] transition-colors space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-center text-[#C47B62]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#85847F]">
                      {feat.tag}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-[#252522] mt-1">{feat.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#85847F] leading-relaxed font-light">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 bg-[#FAF9F6] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="inline-flex items-center space-x-2 text-[#C47B62]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#252522] font-normal leading-tight">
            Your next beautiful moment <br />
            <span className="italic text-[#C47B62]">starts here.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#85847F] max-w-lg mx-auto font-light">
            Tell us about your celebration, budget, and date. Let MOMENZA take care of the details so you can focus on joy.
          </p>
          <div className="pt-2">
            <Link
              to="/planner"
              className="inline-flex items-center space-x-3 bg-[#252522] hover:bg-[#C47B62] text-white px-9 py-4 rounded-full text-sm font-medium transition duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Start Planning with AI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingConcierge />
    </div>
  );
};

export default LandingPage;
