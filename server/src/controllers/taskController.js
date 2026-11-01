import { Tasks } from '../models/index.js';

export const getTasks = async (req, res) => {
  try {
    const { eventId } = req.query;
    const filter = { userId: req.user.id };
    if (eventId) filter.eventId = eventId;
    const items = await Tasks.find(filter);
    return res.json({ success: true, tasks: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { eventId, title, description, deadline, priority, phase, assignedTo } = req.body;
    if (!eventId || !title) {
      return res.status(400).json({ success: false, message: 'Event ID and task title are required.' });
    }

    const task = await Tasks.create({
      eventId,
      userId: req.user.id,
      title,
      description: description || '',
      deadline: deadline || '',
      priority: priority || 'medium',
      phase: phase || 'One month before',
      assignedTo: assignedTo || 'You',
      status: 'pending'
    });

    return res.status(201).json({ success: true, task });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create task.' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    if (task.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    const updated = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, task: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update task.' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    if (task.userId !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized.' });

    await Tasks.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Task removed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete task.' });
  }
};
