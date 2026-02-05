"use client";
import { useEffect, useState } from "react";
import { ExtendedTask, FilterType, PriorityType, Task, TaskStatus } from "../app/types/task";
import { getTasks, saveTasks } from "../app/utils/taskStorage";


export default function Home() {
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<PriorityType>("medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const addTask = () => {
    if (!title.trim()) return;
    const newTask: ExtendedTask = {
      id: crypto.randomUUID(),
      title,
      status: "pending",
      createdAt: Date.now(),
      priority,
      dueDate: dueDate || undefined,
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setTitle("");
    setDueDate("");
    setPriority("medium");
  };

  const toggleStatus = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: (task.status === "pending"
              ? "completed"
              : "pending") as TaskStatus,
          }
        : task,
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "pending") return task.status === "pending";
      if (filter === "completed") return task.status === "completed";
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const highPriorityCount = pendingTasks.filter(
    (task) => task.priority === "high",
  ).length;

  const getPriorityColor = (priority?: PriorityType) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getPriorityDot = (priority?: PriorityType) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                Task Manager
              </h1>
              <p className="text-indigo-100 text-sm">
                Stay organized...
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{pendingTasks.length}</div>
                <div className="text-xs text-indigo-100 uppercase tracking-wide">
                  Pending
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">
                  {completedTasks.length}
                </div>
                <div className="text-xs text-indigo-100 uppercase tracking-wide">
                  Completed
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{highPriorityCount}</div>
                <div className="text-xs text-indigo-100 uppercase tracking-wide">
                  High Priority
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6 space-y-3">
              <div className="flex gap-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="What needs to be done?"
                  className="flex-1 px-4 text-black py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
                <button
                  onClick={addTask}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200 active:translate-y-0 whitespace-nowrap"
                >
                  + Add
                </button>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={() => setPriority("low")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      priority === "low"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Low
                  </button>
                  <button
                    onClick={() => setPriority("medium")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      priority === "medium"
                        ? "bg-yellow-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setPriority("high")}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      priority === "high"
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    High
                  </button>
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-4 text-black py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search tasks..."
                className=" text-black flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "all"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "pending"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === "completed"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Done
                </button>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {tasks.length === 0 ? "📝" : "🔍"}
                </div>
                <p className="text-gray-400 text-lg">
                  {tasks.length === 0
                    ? "No tasks yet. Add one to get started!"
                    : "No tasks found. Try a different search or filter."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border-2 transition-all duration-300 group hover:shadow-md ${
                      task.status === "completed"
                        ? "border-gray-200 opacity-60"
                        : isOverdue(task.dueDate)
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-indigo-300"
                    }`}
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={() => toggleStatus(task.id)}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                      />

                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityDot(
                          task.priority,
                        )}`}
                      />

                      <div className="flex-1 min-w-0">
                        <span
                          onClick={() => toggleStatus(task.id)}
                          className={`cursor-pointer select-none block ${
                            task.status === "completed"
                              ? "text-gray-500 line-through"
                              : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </span>

                        {task.dueDate && (
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                isOverdue(task.dueDate) &&
                                task.status !== "completed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              📅 {formatDate(task.dueDate)}
                              {isOverdue(task.dueDate) &&
                              task.status !== "completed"
                                ? " (Overdue)"
                                : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {task.priority && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium border flex-shrink-0 ${getPriorityColor(
                            task.priority,
                          )}`}
                        >
                          {task.priority}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-100 rounded-lg ml-2 flex-shrink-0 transform hover:scale-110"
                      aria-label="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="mt-6 bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {Math.round((completedTasks.length / tasks.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(completedTasks.length / tasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
