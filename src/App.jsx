import React, { useState, useEffect, useMemo } from 'react';
// ✅ FIXED (Remove Github from imports):
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Plus,
  Search,
  Check,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
  LayoutDashboard,
  X,
  ChevronRight,
  ShieldCheck,
  Globe,
  Terminal,
  FileCode,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Sample initial data for first launch
const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Complete Lab Practical No. 10',
    description: 'Build React Student Task Planner and deploy to Vercel/Netlify with full documentation.',
    category: 'Academic',
    priority: 'High',
    dueDate: '2026-10-30',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Prepare Database Systems PPT',
    description: 'Create 10 slides on B-Trees, Indexing, and Transaction Management for presentation.',
    category: 'Project',
    priority: 'Medium',
    dueDate: '2026-11-02',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Study Operating Systems Scheduling',
    description: 'Review Round Robin, SJF, and Priority Scheduling algorithms with numerical problems.',
    category: 'Study',
    priority: 'High',
    dueDate: '2026-10-28',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Submit General Elective Assignment',
    description: 'Upload PDF report for Technical Writing module on LMS portal.',
    category: 'Personal',
    priority: 'Low',
    dueDate: '2026-11-05',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('student_planner_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    priority: 'Medium',
    dueDate: ''
  });

  // Save tasks to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('student_planner_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, overdue, progress };
  }, [tasks]);

  // Handle Confetti when completing tasks
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Toggle Task Completion
  const toggleTaskCompletion = (id) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedStatus = !task.completed;
        if (updatedStatus) triggerConfetti();
        return { ...task, completed: updatedStatus };
      }
      return task;
    }));
  };

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate
    });
    setIsModalOpen(true);
  };

  // Submit Task (Add or Update)
  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...formData } : t));
    } else {
      const newTask = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
    }

    setIsModalOpen(false);
  };

  // Delete Task
  const confirmDeleteTask = () => {
    if (deletingTaskId) {
      setTasks(prev => prev.filter(t => t.id !== deletingTaskId));
      setDeletingTaskId(null);
    }
  };

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === 'completed') matchesStatus = task.completed;
      if (statusFilter === 'pending') matchesStatus = !task.completed;
      if (statusFilter === 'overdue') matchesStatus = !task.completed && task.dueDate < today;

      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-5 flex flex-col justify-between shadow-sm">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-indigo-500 rounded-xl text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900 leading-tight">TaskPlanner</h1>
              <p className="text-xs text-brand-600 font-medium">Practical #10 Build</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'tasks'
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ListTodo className="w-4 h-4" />
                All Tasks
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {tasks.length}
              </span>
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
            ST
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Student</p>
            <p className="text-[11px] text-slate-400"></p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'dashboard' && 'Welcome back, Student!'}
              {activeTab === 'tasks' && 'Task Management Hub'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {activeTab === 'dashboard' && "Here is your task progress summary for today."}
              {activeTab === 'tasks' && 'Manage, filter, search, and update your academic practical tasks.'}
              {activeTab === 'docs' && 'Source structure, local commands, and step-by-step Vercel deployment.'}
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </button>
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Total Tasks</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                  <ListTodo className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Overdue</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">{stats.overdue}</p>
                </div>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Overall Completion Progress */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-600" />
                  <h3 className="font-semibold text-slate-900">Task Completion Rate</h3>
                </div>
                <span className="text-sm font-bold text-brand-600">{stats.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>

            {/* Quick Task List Preview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900">Recent Priority Tasks</h3>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <ListTodo className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No tasks created yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 3).map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-brand-500 bg-white'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{task.category} • Due {task.dueDate}</p>
                        </div>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ALL TASKS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            
            {/* Search & Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="all">All Categories</option>
                  <option value="Academic">Academic</option>
                  <option value="Study">Study</option>
                  <option value="Project">Project</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>

            {/* Task List Container */}
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ListTodo className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">No tasks found</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query or reset your filters to see your tasks.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPriorityFilter('all'); setCategoryFilter('all'); }}
                  className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-medium transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTasks.map(task => {
                  const isOverdue = !task.completed && task.dueDate && task.dueDate < new Date().toISOString().split('T')[0];
                  return (
                    <div
                      key={task.id}
                      className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                        task.completed ? 'border-slate-200 bg-slate-50/40 opacity-80' :
                        isOverdue ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            task.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                            task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority} Priority
                          </span>

                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {task.category}
                          </span>
                        </div>

                        <h4 className={`font-semibold text-base ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </h4>

                        <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${task.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                          {task.description || 'No additional details provided.'}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className={isOverdue ? 'text-rose-600 font-semibold' : ''}>
                            {task.dueDate ? task.dueDate : 'No deadline'}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                              task.completed
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            {task.completed ? 'Done' : 'Mark Done'}
                          </button>

                          <button
                            onClick={() => openEditModal(task)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingTaskId(task.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* CREATE / EDIT TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Complete Practical Assignment"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Add details, steps, or requirements..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Study">Study</option>
                    <option value="Project">Project</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingTaskId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 border border-slate-100 text-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete this task?</h3>
            <p className="text-xs text-slate-500 mt-1">
              This action cannot be undone. The task will be permanently removed.
            </p>

            <div className="mt-5 flex gap-2 justify-center">
              <button
                onClick={() => setDeletingTaskId(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-medium hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-medium hover:bg-rose-700 transition-all shadow-md shadow-rose-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}