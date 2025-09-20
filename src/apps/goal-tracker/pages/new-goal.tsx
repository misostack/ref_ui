import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoalTrackerStorage } from "../services/storage";
import { Goal, GoalUnit, DEFAULT_COLORS, DEFAULT_ICONS } from "../types";
import IconDisplay from "../components/icon-display";

export default function NewGoal() {
  const navigate = useNavigate();
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_ICONS[0]);
  const [goalUnits, setGoalUnits] = useState<GoalUnit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const units = GoalTrackerStorage.getGoalUnits();
    setGoalUnits(units);
    if (units.length > 0) {
      setSelectedUnitId(units[0].id);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !goalName.trim() ||
      !target ||
      isNaN(Number(target)) ||
      Number(target) <= 0
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const selectedUnit = goalUnits.find((unit) => unit.id === selectedUnitId);
      if (!selectedUnit) return;

      const newGoal: Goal = {
        id: Date.now(), // Simple ID generation
        name: goalName.trim(),
        target: Number(target),
        unit: selectedUnit,
        color: selectedColor,
        icon: selectedIcon,
      };

      GoalTrackerStorage.addGoal(newGoal);

      // Redirect to goal details
      navigate(`/goal-tracker/goal/${newGoal.id}`);
    } catch (error) {
      console.error("Error creating goal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-black mb-1">
          Create New Goal
        </h2>
        <p className="text-gray-600 text-sm">
          Set up a new goal to track your progress
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Name */}
        <div>
          <label className="block text-black font-medium mb-2">Goal Name</label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="e.g., Learn React Native"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Target Value */}
        <div>
          <label className="block text-black font-medium mb-2">Target</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="100"
            min="1"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>

        {/* Goal Unit */}
        <div>
          <label className="block text-black font-medium mb-2">Unit</label>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {goalUnits.map((unit) => (
              <option key={unit.id} value={unit.id} className="bg-gray-800">
                {unit.pluralName}
              </option>
            ))}
          </select>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-black font-medium mb-3">Color</label>
          <div className="grid grid-cols-5 gap-3">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-xl border-2 transition-all ${
                  selectedColor === color
                    ? "border-white scale-110"
                    : "border-white/30 hover:border-white/50"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-black font-medium mb-3">Icon</label>
          <div className="grid grid-cols-5 gap-3">
            {DEFAULT_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                className={`w-12 h-12 rounded-xl bg-gray-50 border-2 flex items-center justify-center transition-all ${
                  selectedIcon === icon
                    ? "border-white scale-110"
                    : "border-white/30 hover:border-white/50"
                }`}
              >
                <IconDisplay icon={icon} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h3 className="text-black font-medium mb-2">Preview</h3>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: selectedColor }}
          >
            <div className="flex items-center gap-3">
              <IconDisplay icon={selectedIcon} size="md" />
              <div>
                <h4 className="text-black font-semibold text-sm">
                  {goalName || "Goal Name"}
                </h4>
                <p className="text-gray-600 text-xs">
                  {target || "0"}{" "}
                  {goalUnits.find((u) => u.id === selectedUnitId)?.pluralName ||
                    "units"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            !goalName.trim() ||
            !target ||
            isNaN(Number(target)) ||
            Number(target) <= 0 ||
            isLoading
          }
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:opacity-50 text-white font-medium py-4 rounded-xl transition-colors"
        >
          {isLoading ? "Creating..." : "Create Goal"}
        </button>
      </form>
    </div>
  );
}
