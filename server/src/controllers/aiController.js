import {
    conciergeChatService,
    generatePlanWithGemini,
    optimizeBudgetService,
    replanDynamicEvent
} from '../services/geminiService.js';

export const generatePlan = async (req, res) => {
  try {
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

    if (!eventName && !userPrompt) {
      return res.status(400).json({ success: false, message: 'Please provide event details or a description of your celebration.' });
    }

    const plan = await generatePlanWithGemini({
      eventName: eventName || 'Unforgettable Celebration',
      eventType: eventType || 'Wedding',
      eventDate: eventDate || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      location: location || 'Lucknow, India',
      guestCount: Number(guestCount) || 300,
      totalBudget: Number(totalBudget) || 800000,
      theme: theme || 'Modern Heritage Elegance',
      foodPreferences: foodPreferences || 'Banquet with artisanal live counters',
      specialRequirements: specialRequirements || '',
      userPrompt: userPrompt || ''
    });

    return res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('AI Plan Generation Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate event plan. Please try again.' });
  }
};

export const dynamicReplan = async (req, res) => {
  try {
    const { currentPlan, changedFields, eventDetails } = req.body;

    if (!currentPlan || !eventDetails) {
      return res.status(400).json({ success: false, message: 'Current plan and updated event details are required.' });
    }

    const result = await replanDynamicEvent({
      currentPlan,
      changedFields: changedFields || {},
      eventDetails
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Dynamic Replanning Error:', error);
    return res.status(500).json({ success: false, message: 'Replanning failed. Please try again.' });
  }
};

export const optimizeBudget = async (req, res) => {
  try {
    const { totalBudget, expenses, eventType } = req.body;

    const result = await optimizeBudgetService({
      totalBudget: Number(totalBudget) || 500000,
      expenses: expenses || [],
      eventType: eventType || 'Wedding'
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Budget Optimization Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to optimize budget.' });
  }
};

export const conciergeChat = async (req, res) => {
  try {
    const { eventContext, question, conversationHistory } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please enter a question for MOMENZA Concierge.' });
    }

    const reply = await conciergeChatService({
      eventContext: eventContext || {},
      question,
      conversationHistory: conversationHistory || []
    });

    return res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('Concierge Chat Error:', error);
    return res.status(500).json({ success: false, message: 'MOMENZA Concierge encountered an error.' });
  }
};

export const regenerateSection = async (req, res) => {
  try {
    const { sectionKey, currentPlan, eventDetails, userFeedback } = req.body;

    // Fast selective regeneration
    const freshPlan = await generatePlanWithGemini({
      ...eventDetails,
      specialRequirements: `Client feedback on ${sectionKey}: ${userFeedback || 'Provide alternative creative recommendations'}`
    });

    const newSectionContent = freshPlan[sectionKey] || freshPlan;

    return res.json({
      success: true,
      sectionKey,
      content: newSectionContent
    });
  } catch (error) {
    console.error('Section Regeneration Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to regenerate section.' });
  }
};
