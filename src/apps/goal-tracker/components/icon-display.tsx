import { DEFAULT_ICONS } from "../types";

interface IconDisplayProps {
  icon: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function IconDisplay({
  icon,
  size = "md",
  className = "",
}: IconDisplayProps) {
  // Map icon file names to emoji fallbacks for now
  // In a real app, these would be actual image files
  const iconMap: Record<string, string> = {
    "image01.jpg": "📚", // Learn/Study
    "image02.jpg": "💪", // Fitness/Strength
    "image03.jpg": "🎯", // Target/Goal
    "image04.jpg": "🏃", // Running/Exercise
    "image05.jpg": "🧠", // Brain/Mind
    "image06.jpg": "💼", // Work/Career
    "image07.jpg": "🎨", // Art/Creativity
    "image08.jpg": "🎵", // Music
    "image09.jpg": "🍎", // Health/Nutrition
    "image10.jpg": "💡", // Ideas/Lightbulb
  };

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  // Check if icon is in our map, otherwise use a fallback
  const displayIcon = iconMap[icon] || icon || "🎯";

  return (
    <div className={`${sizeClasses[size]} ${className}`}>{displayIcon}</div>
  );
}

// Helper function to get a random icon for new goals
export function getRandomIcon(): string {
  const randomIndex = Math.floor(Math.random() * DEFAULT_ICONS.length);
  return DEFAULT_ICONS[randomIndex];
}
