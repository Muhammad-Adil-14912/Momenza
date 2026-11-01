import { Guests } from '../models/index.js';

export const getGuests = async (req, res) => {
  try {
    const { eventId, status, category, search } = req.query;
    const filter = { userId: req.user.id };
    if (eventId) filter.eventId = eventId;
    if (status && status !== 'all') filter.rsvpStatus = status;
    if (category && category !== 'all') filter.category = category;

    let guests = await Guests.find(filter);

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      guests = guests.filter(g =>
        (g.name && g.name.toLowerCase().includes(q)) ||
        (g.email && g.email.toLowerCase().includes(q)) ||
        (g.phone && g.phone.includes(q))
      );
    }

    return res.json({ success: true, guests });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch guests.' });
  }
};

export const createGuest = async (req, res) => {
  try {
    const { eventId, name, email, phone, category, rsvpStatus, additionalGuests, dietaryRequirements, tableNumber } = req.body;
    if (!eventId || !name) {
      return res.status(400).json({ success: false, message: 'Event ID and guest name are required.' });
    }

    const guest = await Guests.create({
      eventId,
      userId: req.user.id,
      name,
      email: email || '',
      phone: phone || '',
      category: category || 'friends',
      rsvpStatus: rsvpStatus || 'pending',
      additionalGuests: Number(additionalGuests) || 0,
      dietaryRequirements: dietaryRequirements || 'None',
      tableNumber: tableNumber || 'Unassigned'
    });

    return res.status(201).json({ success: true, guest });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create guest record.' });
  }
};

export const updateGuest = async (req, res) => {
  try {
    const guest = await Guests.findById(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: 'Guest not found.' });
    if (guest.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    const updated = await Guests.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, guest: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update guest.' });
  }
};

export const deleteGuest = async (req, res) => {
  try {
    const guest = await Guests.findById(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: 'Guest not found.' });
    if (guest.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    await Guests.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Guest deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete guest.' });
  }
};

export const batchImportGuests = async (req, res) => {
  try {
    const { eventId, guests } = req.body;
    if (!eventId || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid guest import data.' });
    }

    const created = [];
    for (const g of guests) {
      if (g.name && g.name.trim() !== '') {
        const doc = await Guests.create({
          eventId,
          userId: req.user.id,
          name: g.name.trim(),
          email: g.email || '',
          phone: g.phone || '',
          category: g.category || 'friends',
          rsvpStatus: g.rsvpStatus || 'pending',
          additionalGuests: Number(g.additionalGuests) || 0,
          dietaryRequirements: g.dietaryRequirements || 'None',
          tableNumber: g.tableNumber || 'Unassigned'
        });
        created.push(doc);
      }
    }

    return res.json({ success: true, count: created.length, guests: created });
  } catch (error) {
    console.error('batchImportGuests error:', error);
    return res.status(500).json({ success: false, message: 'Failed to import guests.' });
  }
};
