import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoalTrackerStorage } from "../services/storage";
import { Goal, GoalTrackingLog } from "../types";
import IconDisplay from "../components/icon-display";

export default function GoalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [logs, setLogs] = useState<GoalTrackingLog[]>([]);
  const [checkInValue, setCheckInValue] = useState("1");
  const [checkInDate, setCheckInDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "30days">(
    "week"
  );
  const [, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const goalId = Number(id);
    const goals = GoalTrackerStorage.getGoals();
    const foundGoal = goals.find((g) => g.id === goalId);

    if (!foundGoal) {
      navigate("/goal-tracker");
      return;
    }

    setGoal(foundGoal);

    const goalLogs = GoalTrackerStorage.getLogsForGoal(goalId);
    setLogs(goalLogs);

    const checkedIn = GoalTrackerStorage.isCheckedInToday(goalId);
    setIsCheckedInToday(checkedIn);
  }, [id, navigate]);

  const getTotalProgress = (): number => {
    return logs.reduce((sum, log) => sum + log.value, 0);
  };

  const getProgressPercentage = (): number => {
    if (!goal) return 0;
    return Math.min((getTotalProgress() / goal.target) * 100, 100);
  };

  const handleCheckIn = () => {
    if (!goal || !checkInValue || isNaN(Number(checkInValue))) return;

    const value = Number(checkInValue);
    const checkInDateObj = new Date(checkInDate);

    GoalTrackerStorage.addTrackingLog({
      goalId: goal.id,
      checkInTime: checkInDateObj,
      value: value,
      unit: goal.unit,
    });

    // Update check-in status for today
    GoalTrackerStorage.updateCheckInStatus(
      goal.id,
      new Date().toDateString(),
      true,
      value
    );

    // Refresh logs
    const updatedLogs = GoalTrackerStorage.getLogsForGoal(goal.id);
    setLogs(updatedLogs);
    setIsCheckedInToday(true);

    // Reset form
    setCheckInValue("1");
    setCheckInDate(new Date().toISOString().split("T")[0]);
  };

  const handleSkip = () => {
    if (!goal) return;

    GoalTrackerStorage.updateCheckInStatus(
      goal.id,
      new Date().toDateString(),
      true,
      0
    );
    setIsCheckedInToday(true);
  };

  const getFilteredLogs = (): GoalTrackingLog[] => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return logs.filter((log) => log.checkInTime >= startDate);
  };

  const getBestStreak = (): number => {
    // Simple streak calculation - could be improved
    const sortedLogs = [...logs].sort(
      (a, b) => a.checkInTime.getTime() - b.checkInTime.getTime()
    );
    let maxStreak = 0;
    let currentStreak = 0;

    for (let i = 0; i < sortedLogs.length; i++) {
      if (sortedLogs[i].value > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  };

  if (!goal) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  const totalProgress = getTotalProgress();
  const progressPercentage = getProgressPercentage();
  const filteredLogs = getFilteredLogs();
  const bestStreak = getBestStreak();

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/goal-tracker")}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <span className="text-black">←</span>
        </button>
        <button
          onClick={() => setShowEditModal(true)}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <span className="text-black">✏️</span>
        </button>
      </div>

      {/* Goal Overview */}
      <div
        className="relative p-6 rounded-2xl text-center overflow-hidden"
        style={{ backgroundColor: goal.color }}
      >
        <IconDisplay icon={goal.icon} size="lg" className="mb-4" />
        <h1 className="text-xl font-bold text-black mb-2">{goal.name}</h1>
        <div className="text-3xl font-bold text-black mb-2">
          {totalProgress}/{goal.target}
        </div>
        <div className="text-gray-600 text-sm mb-4">{goal.unit.pluralName}</div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="text-gray-700 text-sm">
          {progressPercentage.toFixed(0)}% Complete
        </div>
      </div>

      {/* Check-in Status */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        {isCheckedInToday ? (
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-black font-semibold mb-1">Great job!</h3>
            <p className="text-gray-600 text-sm">You've checked in today</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">⏰</div>
            <h3 className="text-black font-semibold mb-1">Time to check in!</h3>
            <p className="text-gray-600 text-sm">
              Don't forget to track your progress
            </p>
          </div>
        )}

        {bestStreak > 0 && (
          <div className="mt-3 text-center">
            <p className="text-gray-500 text-xs">
              Best streak: {bestStreak} days
            </p>
          </div>
        )}
      </div>

      {/* Check-in Form */}
      {!isCheckedInToday && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
          <h3 className="text-black font-semibold">Check In</h3>

          <div>
            <label className="block text-gray-600 text-sm mb-2">
              Progress Value
            </label>
            <input
              type="number"
              value={checkInValue}
              onChange={(e) => setCheckInValue(e.target.value)}
              min="0"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm mb-2">Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCheckIn}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Complete
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded-xl transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Progress Logs */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-black font-semibold">Progress History</h3>
          <select
            value={timeFilter}
            onChange={(e) =>
              setTimeFilter(e.target.value as "week" | "month" | "30days")
            }
            className="px-3 py-1 bg-gray-50 border border-gray-300 rounded-lg text-black text-sm focus:outline-none"
          >
            <option value="week" className="bg-gray-800">
              This Week
            </option>
            <option value="month" className="bg-gray-800">
              This Month
            </option>
            <option value="30days" className="bg-gray-800">
              Last 30 Days
            </option>
          </select>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-gray-500 text-sm">No progress logged yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs
              .sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime())
              .map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <div className="text-black font-medium">
                      +{log.value} {log.unit.singularName}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {log.checkInTime.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    {log.checkInTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
