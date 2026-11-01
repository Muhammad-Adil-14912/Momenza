import { curatedVendors } from '../data/seedData.js';
import { Vendors } from '../models/index.js';

export const getVendors = async (req, res) => {
  try {
    const { category, location, minRating, search } = req.query;

    // Fetch user-custom or saved vendors from DB
    const dbVendors = await Vendors.find();

    // Combine with curated seed vendors
    const all = [...curatedVendors, ...dbVendors];

    // Deduplicate by _id
    const seen = new Set();
    let list = all.filter(v => {
      const id = v._id || v.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    if (category && category !== 'All') {
      list = list.filter(v => v.category?.toLowerCase() === category.toLowerCase());
    }

    if (location && location.trim() !== '') {
      const locQ = location.toLowerCase();
      list = list.filter(v => v.location?.toLowerCase().includes(locQ));
    }

    if (minRating) {
      list = list.filter(v => (v.rating || 0) >= Number(minRating));
    }

    if (search && search.trim() !== '') {
      const s = search.toLowerCase();
      list = list.filter(v =>
        v.businessName?.toLowerCase().includes(s) ||
        v.services?.some(svc => svc.toLowerCase().includes(s)) ||
        v.location?.toLowerCase().includes(s)
      );
    }

    return res.json({ success: true, vendors: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch vendors.' });
  }
};

export const bookVendor = async (req, res) => {
  try {
    const { eventId, vendorId, agreedPrice, bookingStatus, category, businessName, notes } = req.body;
    if (!eventId || !businessName) {
      return res.status(400).json({ success: false, message: 'Event ID and vendor details are required.' });
    }

    const booking = await Vendors.create({
      eventId,
      userId: req.user.id,
      vendorId: vendorId || '',
      businessName,
      category: category || 'General',
      agreedPrice: Number(agreedPrice) || 0,
      bookingStatus: bookingStatus || 'booked',
      notes: notes || ''
    });

    return res.status(201).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to record vendor booking.' });
  }
};
