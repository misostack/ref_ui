import { useState, useEffect } from "react";
import { Goal, GoalUnit, DEFAULT_COLORS, DEFAULT_ICONS } from "../types";
import { GoalTrackerStorage } from "../services/storage";
import IconDisplay from "./icon-display";

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSave: (updatedGoal: Goal) => void;
}

export default function EditGoalModal({
  isOpen,
  onClose,
  goal,
  onSave,
}: EditGoalModalProps) {
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState<GoalUnit | null>(null);
  const [selectedColor, setSelectedColor] = useState("#ff0000");
  const [selectedIcon, setSelectedIcon] = useState("image01.jpg");

  useEffect(() => {
    if (goal) {
      setGoalName(goal.name);
      setTarget(goal.target);
      setSelectedUnit(goal.unit);
      setSelectedColor(goal.color);
      setSelectedIcon(goal.icon);
    }
  }, [goal]);

  const handleSave = () => {
    if (!goal || !selectedUnit || !goalName.trim()) return;

    const updatedGoal: Goal = {
      ...goal,
      name: goalName.trim(),
      target,
      unit: selectedUnit,
      color: selectedColor,
      icon: selectedIcon,
    };

    GoalTrackerStorage.updateGoal(goal.id, updatedGoal);
    onSave(updatedGoal);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-black">Edit Goal</h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Goal Name */}
          <div>
            <label className="block text-black font-medium mb-2">
              Goal Name
            </label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="Enter goal name"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-black font-medium mb-2">Target</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-black font-medium mb-2">Unit</label>
            <select
              value={selectedUnit?.id || ""}
              onChange={(e) => {
                const unitId = parseInt(e.target.value);
                const unit = GoalTrackerStorage.getGoalUnits().find(
                  (u) => u.id === unitId
                );
                setSelectedUnit(unit || null);
              }}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">Select unit</option>
              {GoalTrackerStorage.getGoalUnits().map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.pluralName}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-black font-medium mb-3">Color</label>
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                    selectedColor === color
                      ? "border-gray-800 scale-110"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <span className="text-white text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-black font-medium mb-3">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {DEFAULT_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-12 h-12 rounded-xl bg-gray-50 border-2 flex items-center justify-center transition-all ${
                    selectedIcon === icon
                      ? "border-gray-800 scale-110"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <IconDisplay icon={icon} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-black font-medium mb-2">Preview</h3>
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: selectedColor }}
            >
              <IconDisplay icon={selectedIcon} size="md" className="mb-2" />
              <h4 className="text-white font-semibold text-sm">
                {goalName || "Goal Name"}
              </h4>
              <p className="text-white/80 text-xs">
                Target: {target} {selectedUnit?.pluralName || "units"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!goalName.trim() || !selectedUnit}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
