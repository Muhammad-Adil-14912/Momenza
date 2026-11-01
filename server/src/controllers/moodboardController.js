import { curatedMoodboards } from '../data/seedData.js';
import { Events, Moodboards } from '../models/index.js';

export const getMoodboards = async (req, res) => {
  try {
    const userBoards = req.user ? await Moodboards.find({ userId: req.user.id }) : [];
    const all = [...curatedMoodboards, ...userBoards];
    return res.json({ success: true, moodboards: all });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch moodboards.' });
  }
};

export const createMoodboard = async (req, res) => {
  try {
    const { title, category, description, images, colorPalette, floralIdeas, decorConcepts, tableSetting, eventId } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: 'Title and category are required.' });
    }

    const moodboard = await Moodboards.create({
      userId: req.user.id,
      eventId: eventId || '',
      title,
      category,
      description: description || '',
      images: images || [],
      colorPalette: colorPalette || ['#FAF9F6', '#C47B62', '#A7B29A', '#252522'],
      floralIdeas: floralIdeas || [],
      decorConcepts: decorConcepts || [],
      tableSetting: tableSetting || ''
    });

    return res.status(201).json({ success: true, moodboard });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create moodboard.' });
  }
};

export const applyMoodboardToEvent = async (req, res) => {
  try {
    const { eventId, moodboardId } = req.body;
    if (!eventId || !moodboardId) {
      return res.status(400).json({ success: false, message: 'Event ID and Moodboard ID are required.' });
    }

    const event = await Events.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });
    if (event.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    // Find moodboard from curated or DB
    const all = [...curatedMoodboards, ...(await Moodboards.find())];
    const targetBoard = all.find(m => (m._id || m.id) === moodboardId);
    if (!targetBoard) {
      return res.status(404).json({ success: false, message: 'Moodboard not found.' });
    }

    const updatedPlan = { ...(event.generatedPlan || {}) };
    if (updatedPlan.themeRecommendations) {
      updatedPlan.themeRecommendations.themeTitle = targetBoard.title;
      updatedPlan.themeRecommendations.moodDescription = targetBoard.description;
      if (targetBoard.colorPalette) {
        updatedPlan.themeRecommendations.colorPalette = targetBoard.colorPalette.map(c => ({
          name: typeof c === 'string' ? c : c.name,
          hex: typeof c === 'string' ? c : c.hex,
          role: 'Theme Palette'
        }));
      }
      if (targetBoard.floralIdeas) {
        updatedPlan.themeRecommendations.floralPalette = targetBoard.floralIdeas;
      }
    }

    const updatedEvent = await Events.findByIdAndUpdate(eventId, {
      theme: targetBoard.title,
      'preferences.colorScheme': targetBoard.colorPalette || [],
      generatedPlan: updatedPlan
    }, { new: true });

    return res.json({
      success: true,
      message: `Applied "${targetBoard.title}" moodboard to celebration.`,
      event: updatedEvent
    });
  } catch (error) {
    console.error('applyMoodboardToEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to apply moodboard.' });
  }
};
