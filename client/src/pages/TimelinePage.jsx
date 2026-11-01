import {
    Calendar,
    Check,
    CheckCircle2,
    Circle,
    Clock,
    Plus,
    Sparkles,
    Trash2,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import api from '../services/api';
import { formatDate } from '../utils/formatters';

const TimelinePage = () => {
  const { activeEvent, tasks, setTasks } = useEvents();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPhase, setNewPhase] = useState('One month before');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDeadline, setNewDeadline] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('You');

  const phases = [
    'Three months before',
    'Two months before',
    'One month before',
    'One week before',
    'Event day'
  ];

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleTask = async (task) => {
    const id = task._id || task.id;
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const res = await api.put(`/tasks/${id}`, { status: nextStatus });
      if (res.data?.success) {
        setTasks(prev => prev.map(t => ((t._id || t.id) === id ? res.data.task : t)));
      }
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => (t._id || t.id) !== id));
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!activeEvent?._id) {
      alert('Please select an active event first.');
      return;
    }

    try {
      const res = await api.post('/tasks', {
        eventId: activeEvent._id,
        title: newTitle,
        description: newDesc,
        phase: newPhase,
        priority: newPriority,
        deadline: newDeadline,
        assignedTo: newAssignedTo
      });

      if (res.data?.success) {
        setTasks(prev => [...prev, res.data.task]);
        setShowAddModal(false);
        setNewTitle('');
        setNewDesc('');
        setNewDeadline('');
      }
    } catch (err) {
      alert('Failed to create task.');
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
            Milestones & Action Items
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
            Event Timeline & Tasks
          </h1>
          <p className="text-sm text-[#85847F] mt-1 font-light">
            {activeEvent ? `${activeEvent.eventName} • Target date: ${formatDate(activeEvent.eventDate)}` : 'Select an event to view timeline'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 bg-[#252522] hover:bg-[#C47B62] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Progress Metric Card */}
      <div className="p-6 rounded-3xl bg-white border border-[#EAE8E2] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg text-[#252522]">Execution Velocity</h3>
            <p className="text-xs text-[#85847F]">
              {completedCount} of {totalCount} critical milestones fulfilled
            </p>
          </div>
          <span className="font-serif text-2xl font-bold text-[#C47B62]">{progressPercent}%</span>
        </div>

        <div className="w-full bg-[#FAF9F6] h-2.5 rounded-full overflow-hidden border border-[#EAE8E2]">
          <div
            className="bg-[#C47B62] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Vertical Phased Timeline */}
      <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#EAE8E2]">
        {phases.map((phase) => {
          const phaseTasks = tasks.filter(t => t.phase === phase);
          return (
            <div key={phase} className="relative pl-12 space-y-4">
              {/* Milestone Indicator */}
              <div className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full bg-[#FAF9F6] border-2 border-[#C47B62] ring-4 ring-[#FAF9F6]" />

              <div className="flex items-center space-x-3">
                <h3 className="font-serif text-lg text-[#252522] font-medium">{phase}</h3>
                <span className="text-[10px] bg-white border border-[#EAE8E2] px-2 py-0.5 rounded-full text-[#85847F]">
                  {phaseTasks.length} tasks
                </span>
              </div>

              {phaseTasks.length === 0 ? (
                <p className="text-xs text-[#85847F] italic font-light">No tasks scheduled for this phase.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {phaseTasks.map((t) => {
                    const isDone = t.status === 'completed';
                    return (
                      <div
                        key={t._id || t.id}
                        className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                          isDone
                            ? 'bg-[#FAF9F6]/50 border-[#EAE8E2] opacity-70'
                            : 'bg-white border-[#EAE8E2] hover:border-[#85847F] shadow-xs'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => handleToggleTask(t)}
                            className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border transition ${
                              isDone
                                ? 'bg-[#A7B29A] border-[#A7B29A] text-white'
                                : 'border-[#85847F] hover:border-[#C47B62]'
                            }`}
                          >
                            {isDone && <Check className="w-3 h-3" />}
                          </button>
                          <div className="space-y-1">
                            <p
                              className={`text-xs font-semibold text-[#252522] ${
                                isDone ? 'line-through text-[#85847F]' : ''
                              }`}
                            >
                              {t.title}
                            </p>
                            {t.description && (
                              <p className="text-[11px] text-[#85847F] font-light leading-relaxed line-clamp-2">
                                {t.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 pt-1 text-[10px] text-[#85847F]">
                              {t.deadline && <span>Due: {t.deadline}</span>}
                              <span>•</span>
                              <span>Assignee: {t.assignedTo || 'You'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0">
                          <span
                            className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                              t.priority === 'high'
                                ? 'bg-[#C47B62]/10 text-[#C47B62]'
                                : 'bg-[#FAF9F6] border border-[#EAE8E2] text-[#85847F]'
                            }`}
                          >
                            {t.priority || 'medium'}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(t._id || t.id)}
                            className="p-1 text-[#85847F] hover:text-red-600 transition"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#FAF9F6] p-5 border-b border-[#EAE8E2] flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#252522]">Add Timeline Task</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-[#85847F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm floral centerpiece mockups"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Milestone Phase
                </label>
                <select
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                >
                  {phases.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Deadline (e.g. Day 45)
                  </label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. 2 weeks prior"
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Notes / Practical Tips
                </label>
                <textarea
                  rows="2"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tips or logistics detail..."
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl p-3 text-xs text-[#252522]"
                />
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelinePage;
