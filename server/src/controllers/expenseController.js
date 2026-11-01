import { Expenses } from '../models/index.js';

export const getExpenses = async (req, res) => {
  try {
    const { eventId } = req.query;
    const filter = { userId: req.user.id };
    if (eventId) filter.eventId = eventId;
    const items = await Expenses.find(filter);
    return res.json({ success: true, expenses: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch expenses.' });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { eventId, category, description, estimatedAmount, actualAmount, paymentStatus, notes } = req.body;
    if (!eventId || !category || !description) {
      return res.status(400).json({ success: false, message: 'Event ID, category, and description are required.' });
    }

    const expense = await Expenses.create({
      eventId,
      userId: req.user.id,
      category,
      description,
      estimatedAmount: Number(estimatedAmount) || 0,
      actualAmount: Number(actualAmount) || 0,
      paymentStatus: paymentStatus || 'pending',
      notes: notes || ''
    });

    return res.status(201).json({ success: true, expense });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create expense.' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expenses.findById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found.' });
    if (expense.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    const updated = await Expenses.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, expense: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update expense.' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expenses.findById(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found.' });
    if (expense.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    await Expenses.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Expense removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete expense.' });
  }
};
