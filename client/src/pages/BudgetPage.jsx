import {
    AlertCircle,
    Check,
    CheckCircle2,
    DollarSign,
    Edit2,
    PieChart as PieIcon,
    Plus,
    RefreshCw,
    Sparkles,
    Trash2,
    TrendingDown,
    TrendingUp,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useEvents } from '../context/EventContext';
import api from '../services/api';
import { formatCurrency, formatLakh } from '../utils/formatters';

const BudgetPage = () => {
  const { activeEvent, expenses, setExpenses, updateActiveEvent } = useEvents();

  // Local state for expenses & budget
  const [totalBudget, setTotalBudget] = useState(activeEvent?.totalBudget || 800000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetVal, setNewBudgetVal] = useState(activeEvent?.totalBudget || 800000);

  // New Expense Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState('Decoration');
  const [newDesc, setNewDesc] = useState('');
  const [newEst, setNewEst] = useState('');
  const [newAct, setNewAct] = useState('');
  const [newStatus, setNewStatus] = useState('pending');

  // AI Optimizer State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);

  useEffect(() => {
    if (activeEvent?.totalBudget) {
      setTotalBudget(activeEvent.totalBudget);
      setNewBudgetVal(activeEvent.totalBudget);
    }
  }, [activeEvent]);

  const categories = [
    'Venue',
    'Catering',
    'Decoration',
    'Photography',
    'Videography',
    'Entertainment',
    'Transportation',
    'Accommodation',
    'Clothing',
    'Miscellaneous'
  ];

  // Financial Calculations
  const totalAllocated = expenses.reduce((sum, e) => sum + (Number(e.estimatedAmount) || 0), 0);
  const totalActual = expenses.reduce((sum, e) => sum + (Number(e.actualAmount) || 0), 0);
  const remainingBalance = totalBudget - totalAllocated;
  const isOverBudget = totalAllocated > totalBudget;

  // Chart data
  const chartData = categories
    .map(cat => {
      const catExpenses = expenses.filter(e => e.category === cat);
      const value = catExpenses.reduce((sum, e) => sum + (Number(e.estimatedAmount) || 0), 0);
      return { name: cat, value };
    })
    .filter(item => item.value > 0);

  // Terracotta & Sage color palette for chart
  const COLORS = ['#C47B62', '#A7B29A', '#D4AF37', '#85847F', '#A9614A', '#879478', '#252522', '#D8D4CA'];

  const handleUpdateBudget = async () => {
    try {
      const budgetNum = Number(newBudgetVal);
      await updateActiveEvent({ totalBudget: budgetNum });
      setTotalBudget(budgetNum);
      setIsEditingBudget(false);
    } catch (err) {
      alert('Failed to update total budget.');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!activeEvent?._id) {
      alert('Please select or create an event first.');
      return;
    }

    try {
      const res = await api.post('/expenses', {
        eventId: activeEvent._id,
        category: newCategory,
        description: newDesc,
        estimatedAmount: Number(newEst) || 0,
        actualAmount: Number(newAct) || 0,
        paymentStatus: newStatus
      });

      if (res.data?.success) {
        setExpenses(prev => [...prev, res.data.expense]);
        setShowAddModal(false);
        setNewDesc('');
        setNewEst('');
        setNewAct('');
      }
    } catch (err) {
      alert('Failed to add expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(e => (e._id || e.id) !== id));
    } catch (err) {
      alert('Failed to delete expense.');
    }
  };

  const handleStatusChange = async (expense, nextStatus) => {
    try {
      const id = expense._id || expense.id;
      const res = await api.put(`/expenses/${id}`, { paymentStatus: nextStatus });
      if (res.data?.success) {
        setExpenses(prev => prev.map(e => ((e._id || e.id) === id ? res.data.expense : e)));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleOptimizeBudget = async () => {
    setIsOptimizing(true);
    try {
      const res = await api.post('/ai/optimize-budget', {
        totalBudget,
        expenses,
        eventType: activeEvent?.eventType || 'Wedding'
      });

      if (res.data?.success) {
        setOptimizationResult(res.data);
        setShowOptimizeModal(true);
      }
    } catch (err) {
      alert('Could not run budget optimization.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyRecommendation = (rec) => {
    // Dynamically adjust expense in local state
    setExpenses(prev => {
      return prev.map(item => {
        if (item.category === rec.category) {
          const reduced = Math.max(0, item.estimatedAmount - rec.amountSaved);
          return { ...item, estimatedAmount: reduced };
        }
        return item;
      });
    });

    setOptimizationResult(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(r => (r.id === rec.id ? { ...r, applied: true } : r))
    }));
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE8E2] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#85847F]">
            Financial Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#252522] mt-1 font-normal">
            Intelligent Budget Planner
          </h1>
          <p className="text-sm text-[#85847F] mt-1 font-light">
            {activeEvent ? `${activeEvent.eventName} • Financial ledger & real-time optimization` : 'Select an event to view finances'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOptimizeBudget}
            disabled={isOptimizing}
            className="inline-flex items-center space-x-2 bg-[#FAF9F6] hover:bg-[#F1EDE5] border border-[#C47B62] text-[#C47B62] px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition shadow-xs"
          >
            <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'Analyzing Budget...' : 'Optimize My Budget'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-[#252522] hover:bg-[#C47B62] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Budget Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-1 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">Total Budget</span>
            <button
              onClick={() => setIsEditingBudget(!isEditingBudget)}
              className="text-[#85847F] hover:text-[#252522] p-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          {isEditingBudget ? (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="number"
                value={newBudgetVal}
                onChange={(e) => setNewBudgetVal(e.target.value)}
                className="w-full text-sm p-1.5 border border-[#C47B62] rounded-lg bg-[#FAF9F6] outline-none"
              />
              <button onClick={handleUpdateBudget} className="p-1.5 bg-[#C47B62] text-white rounded-lg text-xs">
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <p className="font-serif text-2xl font-medium text-[#252522]">{formatCurrency(totalBudget)}</p>
          )}
          <p className="text-[10px] text-[#85847F]">Target overall expenditure</p>
        </div>

        {/* Allocated Budget */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">Allocated Budget</span>
          <p className="font-serif text-2xl font-medium text-[#C47B62]">{formatCurrency(totalAllocated)}</p>
          <p className="text-[10px] text-[#85847F]">
            {Math.round((totalAllocated / (totalBudget || 1)) * 100)}% of total budget
          </p>
        </div>

        {/* Actual Spending */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">Actual Disbursed</span>
          <p className="font-serif text-2xl font-medium text-[#252522]">{formatCurrency(totalActual)}</p>
          <p className="text-[10px] text-[#85847F]">Paid invoices & deposits</p>
        </div>

        {/* Remaining Balance */}
        <div className="p-5 rounded-2xl bg-white border border-[#EAE8E2] space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#85847F]">Remaining Buffer</span>
          <p
            className={`font-serif text-2xl font-medium ${
              isOverBudget ? 'text-red-600' : 'text-[#A7B29A]'
            }`}
          >
            {formatCurrency(remainingBalance)}
          </p>
          <p className={`text-[10px] ${isOverBudget ? 'text-red-500 font-medium' : 'text-[#85847F]'}`}>
            {isOverBudget ? 'Exceeds budget limit' : 'Available for contingency'}
          </p>
        </div>
      </div>

      {/* Main Budget Visual Split: Donut Chart & Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Donut Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EAE8E2] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#252522]">Category Allocation</h3>
            <span className="text-xs text-[#85847F]">{chartData.length} active categories</span>
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatCurrency(val), 'Allocated']}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAE8E2', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-xs text-[#85847F]">No categorized expenses yet</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase tracking-wider text-[#85847F]">Allocated</span>
              <span className="font-serif text-sm font-semibold text-[#252522]">{formatLakh(totalAllocated)}</span>
            </div>
          </div>

          {/* Legend Chips */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAE8E2]">
            {chartData.map((item, idx) => (
              <div key={item.name} className="flex items-center space-x-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-[#85847F] truncate">{item.name}</span>
                <span className="text-[#252522] font-medium ml-auto">{formatLakh(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editable Expenses Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EAE8E2] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#252522]">Expense Ledger</h3>
            <span className="text-xs text-[#85847F]">{expenses.length} Line Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAE8E2] text-[#85847F] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pr-2 font-medium">Category / Item</th>
                  <th className="py-2.5 px-2 font-medium">Estimated</th>
                  <th className="py-2.5 px-2 font-medium">Actual</th>
                  <th className="py-2.5 px-2 font-medium">Status</th>
                  <th className="py-2.5 pl-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE8E2]">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-xs text-[#85847F]">
                      No expenses listed. Click "Add Expense" or generate via AI Planner.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp._id || exp.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                      <td className="py-3 pr-2">
                        <p className="font-semibold text-[#252522]">{exp.category}</p>
                        <p className="text-[11px] text-[#85847F] truncate max-w-[180px]">{exp.description}</p>
                      </td>
                      <td className="py-3 px-2 font-medium text-[#252522]">
                        {formatCurrency(exp.estimatedAmount)}
                      </td>
                      <td className="py-3 px-2 text-[#85847F]">
                        {exp.actualAmount ? formatCurrency(exp.actualAmount) : '—'}
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={exp.paymentStatus || 'pending'}
                          onChange={(e) => handleStatusChange(exp, e.target.value)}
                          className="text-[10px] font-medium bg-[#FAF9F6] border border-[#EAE8E2] rounded-lg px-2 py-1 text-[#252522] focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="deposit_paid">Deposit Paid</option>
                          <option value="paid">Paid</option>
                        </select>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp._id || exp.id)}
                          className="p-1 text-[#85847F] hover:text-red-600 transition"
                          title="Delete"
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
      </div>

      {/* AI Budget Optimizer Modal */}
      {showOptimizeModal && optimizationResult && (
        <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#FAF9F6] p-6 border-b border-[#EAE8E2] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-[#C47B62]/10 flex items-center justify-center text-[#C47B62]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#252522]">MOMENZA Budget Optimizer</h3>
                  <p className="text-xs text-[#85847F]">AI Financial Advisory & Tactical Savings</p>
                </div>
              </div>
              <button onClick={() => setShowOptimizeModal(false)} className="p-1 text-[#85847F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  optimizationResult.isOverBudget
                    ? 'bg-red-50/50 border-red-200 text-red-800'
                    : 'bg-[#EFF3EC] border-[#A7B29A] text-[#252522]'
                }`}
              >
                <p className="font-semibold mb-1">
                  {optimizationResult.isOverBudget ? 'Budget Overrun Detected' : 'Healthy Financial Standing'}
                </p>
                <p className="font-light">{optimizationResult.analysisMessage}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#85847F]">
                  Actionable Recommendations
                </h4>
                {optimizationResult.recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE8E2] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-[#252522]">{rec.title}</span>
                        <span className="text-[10px] bg-white border border-[#EAE8E2] px-2 py-0.5 rounded-full text-[#85847F]">
                          {rec.category}
                        </span>
                      </div>
                      {rec.amountSaved > 0 && (
                        <span className="text-xs font-serif font-bold text-[#C47B62]">
                          Save {formatCurrency(rec.amountSaved)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#85847F] font-light leading-relaxed">{rec.description}</p>

                    {rec.amountSaved > 0 && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleApplyRecommendation(rec)}
                          disabled={rec.applied}
                          className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition flex items-center space-x-1 ${
                            rec.applied
                              ? 'bg-green-100 text-green-700 cursor-default'
                              : 'bg-[#C47B62] hover:bg-[#A9614A] text-white'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{rec.applied ? 'Savings Applied' : 'Accept Optimization'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F6] border-t border-[#EAE8E2] flex justify-end">
              <button
                onClick={() => setShowOptimizeModal(false)}
                className="px-5 py-2 text-xs font-medium bg-[#252522] text-white rounded-full"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#252522]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#EAE8E2] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-[#FAF9F6] p-5 border-b border-[#EAE8E2] flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#252522]">Add New Expense</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-[#85847F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Description / Vendor Note
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lawn canopy flowers & lanterns"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Estimated (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newEst}
                    onChange={(e) => setNewEst(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                    Actual Paid (₹)
                  </label>
                  <input
                    type="number"
                    value={newAct}
                    onChange={(e) => setNewAct(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#85847F] mb-1.5">
                  Payment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#EAE8E2] focus:border-[#C47B62] focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-[#252522]"
                >
                  <option value="pending">Pending</option>
                  <option value="deposit_paid">Deposit Paid</option>
                  <option value="paid">Paid</option>
                </select>
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
