import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoalTrackerStorage } from "../services/storage";
import { UserSettings } from "../types";

export default function GoalTrackerSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitPlural, setNewUnitPlural] = useState("");

  useEffect(() => {
    const loadedSettings = GoalTrackerStorage.getUserSettings();
    setSettings(loadedSettings);
  }, []);

  const updateSettings = (updates: Partial<UserSettings>) => {
    if (!settings) return;

    const updatedSettings = { ...settings, ...updates };
    GoalTrackerStorage.saveUserSettings(updatedSettings);
    setSettings(updatedSettings);
  };

  const handleResetData = () => {
    GoalTrackerStorage.resetAllData();
    setShowResetModal(false);
    navigate("/goal-tracker");
  };

  const handleAddUnit = () => {
    if (!newUnitName.trim() || !newUnitPlural.trim()) return;

    const units = GoalTrackerStorage.getGoalUnits();
    const newUnit = {
      id: Date.now(),
      singularName: newUnitName.trim(),
      pluralName: newUnitPlural.trim(),
    };

    units.push(newUnit);
    GoalTrackerStorage.saveGoalUnits(units);

    setNewUnitName("");
    setNewUnitPlural("");
    setShowUnitModal(false);
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
      <div className="text-center">
        <h2 className="text-xl font-semibold text-black mb-1">Settings</h2>
        <p className="text-gray-600 text-sm">
          Customize your goal tracker experience
        </p>
      </div>

      {/* User Name */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-black font-semibold mb-3">Personal Information</h3>
        <div>
          <label className="block text-gray-600 text-sm mb-2">Name</label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => updateSettings({ name: e.target.value })}
            placeholder="Enter your name"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Language */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-black font-semibold mb-3">Language</h3>
        <div>
          <label className="block text-gray-600 text-sm mb-2">Language</label>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="en" className="bg-gray-800">
              English
            </option>
            <option value="es" className="bg-gray-800">
              Español
            </option>
            <option value="fr" className="bg-gray-800">
              Français
            </option>
            <option value="de" className="bg-gray-800">
              Deutsch
            </option>
            <option value="zh" className="bg-gray-800">
              中文
            </option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-black font-semibold mb-3">Notifications</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-black font-medium">Daily Greetings</div>
            <div className="text-gray-600 text-sm">
              Get notified with morning, afternoon, and evening greetings
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                updateSettings({ notifications: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Goal Units */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-black font-semibold">Goal Units</h3>
          <button
            onClick={() => setShowUnitModal(true)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-black text-sm rounded-lg transition-colors"
          >
            Add Unit
          </button>
        </div>

        <div className="space-y-2">
          {GoalTrackerStorage.getGoalUnits().map((unit) => (
            <div
              key={unit.id}
              className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
            >
              <span className="text-black text-sm">
                {unit.singularName} / {unit.pluralName}
              </span>
              <button
                onClick={() => {
                  const units = GoalTrackerStorage.getGoalUnits().filter(
                    (u) => u.id !== unit.id
                  );
                  GoalTrackerStorage.saveGoalUnits(units);
                }}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Data */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="text-black font-semibold mb-3">Data Management</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-black font-medium">Reset All Data</div>
            <div className="text-gray-600 text-sm">
              This will delete all goals, progress, and settings
            </div>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Add Unit Modal */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Add Goal Unit</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Singular Name
                </label>
                <input
                  type="text"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="e.g., time"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Plural Name
                </label>
                <input
                  type="text"
                  value={newUnitPlural}
                  onChange={(e) => setNewUnitPlural(e.target.value)}
                  placeholder="e.g., times"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUnitModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUnit}
                disabled={!newUnitName.trim() || !newUnitPlural.trim()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Reset All Data</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to reset all data? This action cannot be
              undone and will delete all your goals, progress, and settings.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
