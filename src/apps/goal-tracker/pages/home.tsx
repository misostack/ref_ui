import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoalTrackerStorage } from "../services/storage";
import { Goal, UserSettings, APP_COLORS } from "../types";
import IconDisplay from "../components/icon-display";

export default function GoalTrackerHome() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [showNameBox, setShowNameBox] = useState(false);
  const [userName, setUserName] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [secondaryTextColor, setSecondaryTextColor] = useState("#374151");

  useEffect(() => {
    const loadedGoals = GoalTrackerStorage.getGoals();
    const loadedSettings = GoalTrackerStorage.getUserSettings();
    const currentTextColor = GoalTrackerStorage.getTextColor();
    const currentSecondaryTextColor =
      GoalTrackerStorage.getSecondaryTextColor();

    setGoals(loadedGoals);
    setSettings(loadedSettings);
    setTextColor(currentTextColor);
    setSecondaryTextColor(currentSecondaryTextColor);

    // Show name box if user hasn't set their name
    if (!loadedSettings.name) {
      setShowNameBox(true);
    }
  }, []);

  const handleSaveName = () => {
    if (userName.trim()) {
      const updatedSettings = { ...settings!, name: userName.trim() };
      GoalTrackerStorage.saveUserSettings(updatedSettings);
      setSettings(updatedSettings);
      setShowNameBox(false);
    }
  };

  const getProgressPercentage = (goal: Goal): number => {
    const logs = GoalTrackerStorage.getLogsForGoal(goal.id);
    const totalProgress = logs.reduce((sum, log) => sum + log.value, 0);
    return Math.min((totalProgress / goal.target) * 100, 100);
  };

  const getCheckInStatus = (goal: Goal): "good" | "warning" | "danger" => {
    const isCheckedInToday = GoalTrackerStorage.isCheckedInToday(goal.id);

    if (isCheckedInToday) return "good";

    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    const hoursLeft = (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursLeft < 4) return "danger";
    if (hoursLeft < 8) return "warning";
    return "good";
  };

  const getStatusIcon = (status: "good" | "warning" | "danger"): string => {
    switch (status) {
      case "good":
        return "😊";
      case "warning":
        return "😐";
      case "danger":
        return "😟";
    }
  };

  const getTotalProgress = (goal: Goal): number => {
    const logs = GoalTrackerStorage.getLogsForGoal(goal.id);
    return logs.reduce((sum, log) => sum + log.value, 0);
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simple Test */}
      <div className="text-center p-4 bg-green-100 rounded-lg">
        <h2 className="text-lg font-bold text-black">Goal Tracker Home Page</h2>
        <p className="text-sm text-gray-700">
          This should be visible if the component is working
        </p>
      </div>

      {/* Welcome Message */}
      {settings.name && (
        <div className="text-center">
          <h2
            className="text-xl font-semibold mb-1"
            style={{ color: textColor }}
          >
            Welcome back, {settings.name}!
          </h2>
          <p className="text-sm" style={{ color: secondaryTextColor }}>
            Let's make today count
          </p>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-2 gap-4">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal);
          const totalProgress = getTotalProgress(goal);
          const status = getCheckInStatus(goal);

          return (
            <button
              key={goal.id}
              onClick={() => navigate(`/goal-tracker/goal/${goal.id}`)}
              className="relative p-4 rounded-2xl text-left transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: goal.color }}
            >
              {/* Icon */}
              <IconDisplay icon={goal.icon} size="md" className="mb-2" />

              {/* Goal Name */}
              <h3 className="font-semibold text-black text-sm mb-2 line-clamp-2">
                {goal.name}
              </h3>

              {/* Progress */}
              <div className="text-xs text-gray-700 mb-2">
                {totalProgress}/{goal.target} {goal.unit.pluralName}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Check-in Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {progress.toFixed(0)}%
                </span>
                <span className="text-lg">{getStatusIcon(status)}</span>
              </div>
            </button>
          );
        })}

        {/* Add Goal Button */}
        <button
          onClick={() => navigate("/goal-tracker/new")}
          className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed transition-colors min-h-[140px]"
          style={{
            backgroundColor: `${APP_COLORS.light}20`,
            borderColor: `${APP_COLORS.dark}30`,
            color: APP_COLORS.dark,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${APP_COLORS.light}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${APP_COLORS.light}20`;
          }}
        >
          <span className="text-3xl mb-2">➕</span>
          <span className="font-medium text-sm">Add Goal</span>
        </button>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: textColor }}
          >
            No Goals Yet
          </h3>
          <p className="text-sm mb-6" style={{ color: secondaryTextColor }}>
            Create your first goal to start tracking your progress
          </p>
          <button
            onClick={() => navigate("/goal-tracker/new")}
            className="font-medium px-6 py-3 rounded-xl transition-colors"
            style={{
              backgroundColor: APP_COLORS.accent,
              color: APP_COLORS.light,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${APP_COLORS.accent}E0`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = APP_COLORS.accent;
            }}
          >
            Create Your First Goal
          </button>
        </div>
      )}

      {/* First Time Name Setup Box */}
      {showNameBox && (
        <div
          className="rounded-xl p-6 border mb-6"
          style={{
            backgroundColor: `${APP_COLORS.light}20`,
            borderColor: `${APP_COLORS.dark}30`,
          }}
        >
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: textColor }}
          >
            Welcome to Goal Tracker!
          </h3>
          <p className="text-sm mb-4" style={{ color: secondaryTextColor }}>
            What should we call you?
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "white",
                borderColor: "#d1d5db",
                color: textColor,
                border: "1px solid #d1d5db",
              }}
              autoFocus
              onKeyPress={(e) => e.key === "Enter" && handleSaveName()}
            />
            <button
              onClick={handleSaveName}
              disabled={!userName.trim()}
              className="font-medium px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
              style={{
                backgroundColor: APP_COLORS.accent,
                color: APP_COLORS.light,
              }}
              onMouseEnter={(e) => {
                if (userName.trim()) {
                  e.currentTarget.style.backgroundColor = `${APP_COLORS.accent}E0`;
                }
              }}
              onMouseLeave={(e) => {
                if (userName.trim()) {
                  e.currentTarget.style.backgroundColor = APP_COLORS.accent;
                }
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
