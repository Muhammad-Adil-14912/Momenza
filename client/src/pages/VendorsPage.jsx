import {
    Calendar,
    CheckCircle2,
    DollarSign,
    ExternalLink,
    Filter,
    HeartHandshake,
    Info,
    Mail,
    MapPin,
    Phone,
    Search,
    Sparkles,
    Star,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useEvents } from '../context/EventContext';
import api from '../services/api';

const VendorsPage = () => {
  const { activeEvent } = useEvents();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [bookingVendor, setBookingVendor] = useState(null);
  const [agreedPrice, setAgreedPrice] = useState('');
  const [bookingStatus, setBookingStatus] = useState('booked');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const categories = [
    'All',
    'Venues',
    'Caterers',
    'Photographers',
    'Decorators',
    'Makeup Artists',
    'DJs',
    'Event Managers',
    'Transportation'
  ];

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedLocation) params.location = selectedLocation;
      if (searchQuery) params.search = searchQuery;

      const res = await api.get('/vendors', { params });
      if (res.data?.success) {
        setVendors(res.data.vendors || []);
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [selectedCategory, selectedLocation, searchQuery]);

  const handleBookVendor = async (e) => {
    e.preventDefault();
    if (!activeEvent?._id) {
      alert('Please select an active event first.');
      return;
    }

    try {
      const res = await api.post('/vendors/book', {
        eventId: activeEvent._id,
        vendorId: bookingVendor._id || bookingVendor.id,
        businessName: bookingVendor.businessName,
        category: bookingVendor.category,
        agreedPrice: Number(agreedPrice) || bookingVendor.agreedPrice || 0,
        bookingStatus
      });

      if (res.data?.success) {
        setBookingSuccessMsg(`Successfully booked "${bookingVendor.businessName}" for ${activeEvent.eventName}!`);
        setTimeout(() => {
          setBookingSuccessMsg('');
          setBookingVendor(null);
        }, 2000);
      }
    } catch (err) {
      alert('Could not record booking.');
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
            Curated Artisans & Partners
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
            Vendor Discovery
          </h1>
          <p className="text-sm text-[#85847F] mt-1 font-light">
            Hand-vetted venues, master culinary artists, and editorial scenographers.
          </p>
        </div>

        {/* Demo Data Transparency Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F6] border border-[#EAE8E2] text-[11px] text-[#85847F]">
          <Info className="w-3.5 h-3.5 text-[#C47B62]" />
          <span>Curated Sample Profiles (Verified Data)</span>
        </div>
      </div>

      {/* Categories & Filter Bar */}
      <div className="space-y-4">
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

        {/* Search & Location inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-[#EAE8E2]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#85847F] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search vendors by service or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#252522]"
            />
          </div>

          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-[#85847F] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Filter by city (e.g. Lucknow, Bangalore, Delhi)..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#252522]"
            />
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#85847F]">Loading curated artisans...</div>
      ) : vendors.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#EAE8E2] text-xs text-[#85847F]">
          No vendors found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor._id || vendor.id}
              className="rounded-3xl overflow-hidden bg-white border border-[#EAE8E2] hover:border-[#C47B62] transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="h-52 relative overflow-hidden bg-[#FAF9F6]">
                  <img
                    src={vendor.image}
                    alt={vendor.businessName}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 text-[10px] uppercase font-semibold bg-white/95 text-[#252522] px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {vendor.category}
                  </span>
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/95 px-2 py-0.5 rounded-full text-xs font-semibold text-[#252522]">
                    <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    <span>{vendor.rating}</span>
                    <span className="text-[10px] text-[#85847F]">({vendor.reviewsCount})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-[#252522]">
                      {vendor.businessName}
                    </h3>
                    <p className="text-xs text-[#85847F] flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C47B62] shrink-0" />
                      <span className="truncate">{vendor.location}</span>
                    </p>
                  </div>

                  {/* Pricing Range */}
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE8E2] flex items-center justify-between text-xs">
                    <span className="text-[#85847F]">Typical Investment</span>
                    <span className="font-serif font-medium text-[#C47B62]">{vendor.pricingRange}</span>
                  </div>

                  {/* Services List */}
                  {vendor.services && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] uppercase font-semibold text-[#85847F]">Key Specialties</p>
                      <div className="flex flex-wrap gap-1.5">
                        {vendor.services.map((svc, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-white border border-[#EAE8E2] px-2 py-0.5 rounded-full text-[#252522]"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 border-t border-[#EAE8E2] mt-4 flex items-center justify-between gap-2">
                <div className="text-[11px] text-[#85847F] truncate">
                  <a href={`tel:${vendor.phone}`} className="hover:text-[#252522] underline">
                    {vendor.phone}
                  </a>
                </div>
                <button
                  onClick={() => {
                    setBookingVendor(vendor);
                    setAgreedPrice(vendor.agreedPrice || '');
                  }}
                  className="bg-[#252522] hover:bg-[#C47B62] text-white text-xs font-medium px-4 py-2 rounded-full transition shadow-xs"
                >
                  Book for Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingVendor && (
        <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#FAF9F6] p-5 border-b border-[#EAE8E2] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#252522]">Book Vendor</h3>
                <p className="text-xs text-[#85847F]">Link to {activeEvent?.eventName || 'active celebration'}</p>
              </div>
              <button onClick={() => setBookingVendor(null)} className="p-1 text-[#85847F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccessMsg ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
                <p className="text-sm font-medium text-[#252522]">{bookingSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleBookVendor} className="p-6 space-y-4">
                <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2]">
                  <p className="text-xs font-semibold text-[#252522]">{bookingVendor.businessName}</p>
                  <p className="text-[11px] text-[#85847F]">{bookingVendor.category} • {bookingVendor.location}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Agreed / Quoted Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={agreedPrice}
                    onChange={(e) => setAgreedPrice(e.target.value)}
                    required
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Booking Status
                  </label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  >
                    <option value="booked">Booked (Deposit Confirmed)</option>
                    <option value="quoted">Quoted / In Review</option>
                    <option value="inquired">Initial Inquiry</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setBookingVendor(null)}
                    className="px-4 py-2 text-xs text-[#85847F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C47B62] hover:bg-[#A9614A] text-white text-xs font-medium rounded-full shadow-sm"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
