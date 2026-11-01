import { Events, Expenses, Guests, Tasks } from '../models/index.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Events.find({ userId: req.user.id });
    return res.json({ success: true, events });
  } catch (error) {
    console.error('getEvents error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    if (event.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this event.' });
    }

    const tasks = await Tasks.find({ eventId: event._id });
    const expenses = await Expenses.find({ eventId: event._id });
    const guests = await Guests.find({ eventId: event._id });

    return res.json({
      success: true,
      event,
      tasks,
      expenses,
      guests
    });
  } catch (error) {
    console.error('getEventById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch event details.' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      eventType,
      eventDate,
      location,
      guestCount,
      totalBudget,
      theme,
      preferences,
      generatedPlan
    } = req.body;

    if (!eventName || !eventType || !totalBudget) {
      return res.status(400).json({ success: false, message: 'Event name, type, and budget are required.' });
    }

    const initialPlanVersion = {
      version: 1,
      timestamp: new Date().toISOString(),
      summary: 'Initial AI Generated Plan',
      plan: generatedPlan || {}
    };

    const newEvent = await Events.create({
      userId: req.user.id,
      eventName,
      eventType,
      eventDate: eventDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      location: location || 'TBD',
      guestCount: Number(guestCount) || 100,
      totalBudget: Number(totalBudget) || 500000,
      theme: theme || 'Modern Heritage Elegance',
      preferences: preferences || {},
      generatedPlan: generatedPlan || {},
      planVersions: [initialPlanVersion]
    });

    // Auto-create initial tasks from generated plan's preparation timeline
    if (generatedPlan?.preparationTimeline && Array.isArray(generatedPlan.preparationTimeline)) {
      for (const phaseObj of generatedPlan.preparationTimeline) {
        if (Array.isArray(phaseObj.tasks)) {
          for (const t of phaseObj.tasks) {
            await Tasks.create({
              eventId: newEvent._id,
              userId: req.user.id,
              title: t.title,
              description: t.tips || '',
              deadline: t.deadline || '',
              priority: t.priority || 'medium',
              phase: phaseObj.phase || 'One month before',
              status: 'pending'
            });
          }
        }
      }
    }

    // Auto-create initial expense breakdown from budget breakdown
    if (generatedPlan?.budgetBreakdown && Array.isArray(generatedPlan.budgetBreakdown)) {
      for (const item of generatedPlan.budgetBreakdown) {
        await Expenses.create({
          eventId: newEvent._id,
          userId: req.user.id,
          category: item.category,
          description: item.strategicRationale || `${item.category} primary allocation`,
          estimatedAmount: item.allocatedAmount,
          actualAmount: 0,
          paymentStatus: 'pending'
        });
      }
    }

    return res.status(201).json({
      success: true,
      event: newEvent
    });
  } catch (error) {
    console.error('createEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create celebration.' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    if (event.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const updateData = { ...req.body };
    delete updateData.userId; // Prevent transferring ownership

    // Handle plan versioning if generatedPlan was updated
    if (req.body.generatedPlan && JSON.stringify(req.body.generatedPlan) !== JSON.stringify(event.generatedPlan)) {
      const currentVersions = event.planVersions || [];
      const newVersionNum = currentVersions.length + 1;
      const newVersion = {
        version: newVersionNum,
        timestamp: new Date().toISOString(),
        summary: req.body.versionSummary || `Plan Version ${newVersionNum}`,
        plan: req.body.generatedPlan
      };
      updateData.planVersions = [...currentVersions, newVersion];
    }

    const updatedEvent = await Events.findByIdAndUpdate(req.params.id, updateData, { new: true });

    return res.json({
      success: true,
      event: updatedEvent
    });
  } catch (error) {
    console.error('updateEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    if (event.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await Events.findByIdAndDelete(req.params.id);
    await Tasks.deleteMany({ eventId: req.params.id });
    await Expenses.deleteMany({ eventId: req.params.id });
    await Guests.deleteMany({ eventId: req.params.id });

    return res.json({ success: true, message: 'Event and associated records deleted successfully.' });
  } catch (error) {
    console.error('deleteEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

export const restorePlanVersion = async (req, res) => {
  try {
    const { versionNumber } = req.body;
    const event = await Events.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    if (event.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    const targetVersion = (event.planVersions || []).find(v => v.version === Number(versionNumber));
    if (!targetVersion) {
      return res.status(404).json({ success: false, message: `Version ${versionNumber} not found.` });
    }

    const newVersion = {
      version: (event.planVersions?.length || 0) + 1,
      timestamp: new Date().toISOString(),
      summary: `Restored from Version ${versionNumber}`,
      plan: targetVersion.plan
    };

    const updated = await Events.findByIdAndUpdate(req.params.id, {
      generatedPlan: targetVersion.plan,
      planVersions: [...(event.planVersions || []), newVersion]
    }, { new: true });

    return res.json({
      success: true,
      message: `Restored to Version ${versionNumber}`,
      event: updated
    });
  } catch (error) {
    console.error('restorePlanVersion error:', error);
    return res.status(500).json({ success: false, message: 'Failed to restore plan version.' });
  }
};
