import {
    CheckCircle2,
    Clock,
    Download,
    FileSpreadsheet,
    Filter,
    Plus,
    Search,
    Trash2,
    Upload,
    Users,
    X,
    XCircle
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useEvents } from '../context/EventContext';
import api from '../services/api';

const GuestsPage = () => {
  const { activeEvent, guests, setGuests } = useEvents();
  const fileInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add Guest Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('friends');
  const [rsvpStatus, setRsvpStatus] = useState('pending');
  const [additionalGuests, setAdditionalGuests] = useState(0);
  const [dietaryRequirements, setDietaryRequirements] = useState('None');
  const [tableNumber, setTableNumber] = useState('Unassigned');

  // Calculate Attendance Summaries
  const totalInvited = guests.length;
  const accepted = guests.filter(g => g.rsvpStatus === 'accepted');
  const declined = guests.filter(g => g.rsvpStatus === 'declined');
  const pending = guests.filter(g => g.rsvpStatus === 'pending');

  const totalHeadcount = accepted.reduce((sum, g) => sum + 1 + (Number(g.additionalGuests) || 0), 0);

  // Filtered List
  const filteredGuests = guests.filter(g => {
    const matchesSearch =
      !searchTerm ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || g.rsvpStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!activeEvent?._id) {
      alert('Please select an active celebration first.');
      return;
    }

    try {
      const res = await api.post('/guests', {
        eventId: activeEvent._id,
        name,
        email,
        phone,
        category,
        rsvpStatus,
        additionalGuests: Number(additionalGuests),
        dietaryRequirements,
        tableNumber
      });

      if (res.data?.success) {
        setGuests(prev => [...prev, res.data.guest]);
        setShowAddModal(false);
        setName('');
        setEmail('');
        setPhone('');
        setAdditionalGuests(0);
      }
    } catch (err) {
      alert('Failed to add guest.');
    }
  };

  const handleStatusChange = async (guest, newStatus) => {
    try {
      const id = guest._id || guest.id;
      const res = await api.put(`/guests/${id}`, { rsvpStatus: newStatus });
      if (res.data?.success) {
        setGuests(prev => prev.map(g => ((g._id || g.id) === id ? res.data.guest : g)));
      }
    } catch (err) {
      console.error('Failed to update RSVP:', err);
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await api.delete(`/guests/${id}`);
      setGuests(prev => prev.filter(g => (g._id || g.id) !== id));
    } catch (err) {
      alert('Failed to delete guest.');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (guests.length === 0) {
      alert('No guests to export.');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Category', 'RSVP Status', 'Additional Guests', 'Dietary', 'Table Number'];
    const rows = guests.map(g => [
      `"${g.name}"`,
      `"${g.email || ''}"`,
      `"${g.phone || ''}"`,
      `"${g.category}"`,
      `"${g.rsvpStatus}"`,
      g.additionalGuests || 0,
      `"${g.dietaryRequirements || ''}"`,
      `"${g.tableNumber || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeEvent?.eventName || 'Momenza'}_Guest_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleCSVImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeEvent?._id) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') return;

      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (lines.length <= 1) return;

      const parsedGuests = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols[0]) {
          parsedGuests.push({
            name: cols[0],
            email: cols[1] || '',
            phone: cols[2] || '',
            category: cols[3]?.toLowerCase() || 'friends',
            rsvpStatus: cols[4]?.toLowerCase() || 'pending',
            additionalGuests: Number(cols[5]) || 0,
            dietaryRequirements: cols[6] || 'None',
            tableNumber: cols[7] || 'Unassigned'
          });
        }
      }

      try {
        const res = await api.post('/guests/batch', {
          eventId: activeEvent._id,
          guests: parsedGuests
        });
        if (res.data?.success) {
          setGuests(prev => [...prev, ...(res.data.guests || [])]);
          alert(`Successfully imported ${res.data.count} guests!`);
        }
      } catch (err) {
        alert('Failed to import CSV.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
            Hospitality & RSVPs
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
            Guest Management
          </h1>
          <p className="text-sm text-[#85847F] mt-1 font-light">
            {activeEvent ? `${activeEvent.eventName} • RSVP Tracking & Dietary Accommodations` : 'Select an event'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCSVImport}
            accept=".csv"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-medium bg-white hover:bg-[#F1EDE5] border border-[#EAE8E2] text-[#252522] px-3.5 py-2.5 rounded-full transition flex items-center space-x-1.5 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="text-xs font-medium bg-white hover:bg-[#F1EDE5] border border-[#EAE8E2] text-[#252522] px-3.5 py-2.5 rounded-full transition flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-[#252522] hover:bg-[#C47B62] text-white px-5 py-2.5 rounded-full text-xs font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Attendance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#85847F]">Total Invited</span>
          <p className="font-serif text-2xl font-medium text-[#252522] mt-1">{totalInvited}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A7B29A]">Confirmed</span>
          <p className="font-serif text-2xl font-medium text-[#A7B29A] mt-1">{accepted.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#85847F]">Pending RSVP</span>
          <p className="font-serif text-2xl font-medium text-[#85847F] mt-1">{pending.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E2]">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-500">Declined</span>
          <p className="font-serif text-2xl font-medium text-red-600 mt-1">{declined.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] col-span-2 lg:col-span-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C47B62]">Total Headcount</span>
          <p className="font-serif text-2xl font-medium text-[#C47B62] mt-1">{totalHeadcount}</p>
          <span className="text-[9px] text-[#85847F]">Including confirmed +1s</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EAE8E2]">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#85847F] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl pl-9 pr-3 py-2 text-xs text-[#252522]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF9F6] border border-[#EAE8E2] text-xs text-[#252522] rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All RSVP Statuses</option>
            <option value="accepted">Confirmed (Accepted)</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF9F6] border border-[#EAE8E2] text-xs text-[#252522] rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="vip">VIP</option>
            <option value="colleagues">Colleagues</option>
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-3xl border border-[#EAE8E2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-[#EAE8E2] text-[#85847F] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-medium">Guest Name</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">RSVP Status</th>
                <th className="py-3 px-4 font-medium">+1s</th>
                <th className="py-3 px-4 font-medium">Dietary / Table</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE8E2]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-xs text-[#85847F]">
                    No guests found. Click "Add Guest" or import via CSV.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((g) => (
                  <tr key={g._id || g.id} className="hover:bg-[#FAF9F6]/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#252522]">{g.name}</p>
                      <p className="text-[11px] text-[#85847F]">{g.email || g.phone || 'No direct contact'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize bg-[#FAF9F6] border border-[#EAE8E2] px-2.5 py-1 rounded-full text-[10px] text-[#252522]">
                        {g.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={g.rsvpStatus}
                        onChange={(e) => handleStatusChange(g, e.target.value)}
                        className={`text-[10px] font-medium rounded-lg px-2.5 py-1 focus:outline-none border ${
                          g.rsvpStatus === 'accepted'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : g.rsvpStatus === 'declined'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#252522]">
                      {g.additionalGuests > 0 ? `+${g.additionalGuests}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-[#252522]">{g.dietaryRequirements || 'Standard'}</p>
                      <p className="text-[10px] text-[#85847F]">Table: {g.tableNumber || 'Unassigned'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteGuest(g._id || g.id)}
                        className="p-1 text-[#85847F] hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#FAF9F6] p-5 border-b border-[#EAE8E2] flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#252522]">Add Guest</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-[#85847F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singhania"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="vikram@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  >
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="vip">VIP</option>
                    <option value="colleagues">Colleagues</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Additional Guests (+1s)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={additionalGuests}
                    onChange={(e) => setAdditionalGuests(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Dietary Requirements
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetarian, Nut Allergy"
                    value={dietaryRequirements}
                    onChange={(e) => setDietaryRequirements(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Table Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 04"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-[#85847F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C47B62] hover:bg-[#A9614A] text-white text-xs font-medium rounded-full shadow-sm"
                >
                  Add to Guest List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestsPage;
