import {
    conciergeChatService,
    generatePlanWithGemini,
    optimizeBudgetService,
    replanDynamicEvent
} from '../services/geminiService.js';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = (value, maxLength) => typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
const isOptionalText = (value, maxLength) => value === undefined || value === null || (typeof value === 'string' && value.length <= maxLength);
const isFiniteNumber = (value, min, max) => value !== undefined && value !== null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= min && Number(value) <= max;

export const generatePlan = async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ success: false, message: 'A valid event details object is required.' });
    }

    const {
      eventName,
      eventType,
      eventDate,
      location,
      guestCount,
      totalBudget,
      theme,
      foodPreferences,
      specialRequirements,
      userPrompt
    } = req.body;

    if (!isOptionalText(eventName, 120) || !isOptionalText(eventType, 80) ||
        !isOptionalText(eventDate, 40) || !isOptionalText(location, 160) ||
        !isOptionalText(theme, 120) || !isOptionalText(foodPreferences, 500) ||
        !isOptionalText(specialRequirements, 2000) || !isOptionalText(userPrompt, 4000)) {
      return res.status(400).json({ success: false, message: 'One or more event fields are invalid or too long.' });
    }

    if (!isText(eventName, 120) && !isText(userPrompt, 4000)) {
      return res.status(400).json({ success: false, message: 'Please provide event details or a description of your celebration.' });
    }

    if (guestCount !== undefined && !isFiniteNumber(guestCount, 1, 10000)) {
      return res.status(400).json({ success: false, message: 'Guest count must be between 1 and 10,000.' });
    }
    if (totalBudget !== undefined && !isFiniteNumber(totalBudget, 1, 1000000000)) {
      return res.status(400).json({ success: false, message: 'Budget must be a valid positive amount.' });
    }

    const plan = await generatePlanWithGemini({
      eventName: eventName || 'Unforgettable Celebration',
      eventType: eventType || 'Wedding',
      eventDate: eventDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: location || 'Lucknow, India',
      guestCount: guestCount === undefined ? 300 : Number(guestCount),
      totalBudget: totalBudget === undefined ? 800000 : Number(totalBudget),
      theme: theme || 'Modern Heritage Elegance',
      foodPreferences: foodPreferences || 'Banquet with artisanal live counters',
      specialRequirements: specialRequirements || '',
      userPrompt: userPrompt || ''
    });

    return res.json({ success: true, plan });
  } catch (error) {
    console.error('AI Plan Generation Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate event plan. Please try again.' });
  }
};

export const dynamicReplan = async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ success: false, message: 'A valid replanning request is required.' });
    }
    const { currentPlan, changedFields, eventDetails } = req.body;

    if (!isObject(currentPlan) || !isObject(eventDetails) ||
        (changedFields !== undefined && !isObject(changedFields))) {
      return res.status(400).json({ success: false, message: 'Current plan, updated event details, and valid changed fields are required.' });
    }

    if (JSON.stringify(currentPlan).length > 100000 || JSON.stringify(eventDetails).length > 20000 ||
        (changedFields && JSON.stringify(changedFields).length > 10000)) {
      return res.status(413).json({ success: false, message: 'Replanning input is too large.' });
    }

    const result = await replanDynamicEvent({
      currentPlan,
      changedFields: changedFields || {},
      eventDetails
    });

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Dynamic Replanning Error:', error);
    return res.status(500).json({ success: false, message: 'Replanning failed. Please try again.' });
  }
};

export const optimizeBudget = async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ success: false, message: 'A valid budget request is required.' });
    }
    const { totalBudget, expenses, eventType } = req.body;

    if (totalBudget !== undefined && !isFiniteNumber(totalBudget, 1, 1000000000)) {
      return res.status(400).json({ success: false, message: 'Budget must be a valid positive amount.' });
    }
    if (eventType !== undefined && !isText(eventType, 80)) {
      return res.status(400).json({ success: false, message: 'Event type must be a non-empty string of at most 80 characters.' });
    }
    if (expenses !== undefined && (!Array.isArray(expenses) || expenses.length > 100)) {
      return res.status(400).json({ success: false, message: 'Expenses must be an array containing no more than 100 items.' });
    }

    const result = await optimizeBudgetService({
      totalBudget: totalBudget === undefined ? 500000 : Number(totalBudget),
      expenses: expenses || [],
      eventType: eventType || 'Wedding'
    });

    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('Budget Optimization Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to optimize budget.' });
  }
};

export const conciergeChat = async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ success: false, message: 'A valid chat request is required.' });
    }
    const { eventContext, question, conversationHistory } = req.body;

    if (!isText(question, 2000)) {
      return res.status(400).json({ success: false, message: 'Please enter a question of at most 2,000 characters.' });
    }
    if (eventContext !== undefined && !isObject(eventContext)) {
      return res.status(400).json({ success: false, message: 'Event context must be an object.' });
    }
    if (conversationHistory !== undefined &&
        (!Array.isArray(conversationHistory) || conversationHistory.length > 20 ||
         conversationHistory.some((entry) => !isObject(entry) ||
           !['user', 'assistant'].includes(entry.role) ||
           typeof entry.content !== 'string' || entry.content.length > 4000))) {
      return res.status(400).json({ success: false, message: 'Conversation history must contain at most 20 valid messages.' });
    }

    const reply = await conciergeChatService({
      eventContext: eventContext || {},
      question: question.trim(),
      conversationHistory: conversationHistory || []
    });

    return res.json({ success: true, reply });
  } catch (error) {
    console.error('Concierge Chat Error:', error);
    return res.status(500).json({ success: false, message: 'MOMENZA Concierge encountered an error.' });
  }
};

export const regenerateSection = async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ success: false, message: 'A valid section regeneration request is required.' });
    }
    const { sectionKey, currentPlan, eventDetails, userFeedback } = req.body;

    if (!isText(sectionKey, 60) || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(sectionKey) ||
        !isObject(currentPlan) || !isObject(eventDetails) ||
        !isOptionalText(userFeedback, 2000)) {
      return res.status(400).json({ success: false, message: 'Section key, current plan, event details, or feedback is invalid.' });
    }

    // Fast selective regeneration
    const freshPlan = await generatePlanWithGemini({
      ...eventDetails,
      specialRequirements: `Client feedback on ${sectionKey}: ${userFeedback || 'Provide alternative creative recommendations'}`
    });

    const newSectionContent = freshPlan[sectionKey] || freshPlan;

    return res.json({ success: true, sectionKey, content: newSectionContent });
  } catch (error) {
    console.error('Section Regeneration Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to regenerate section.' });
  }
};
