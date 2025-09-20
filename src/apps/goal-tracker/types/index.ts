export interface GoalUnit {
  id: number;
  singularName: string;
  pluralName: string;
}

export interface Goal {
  id: number;
  name: string;
  target: number;
  unit: GoalUnit;
  color: string;
  icon: string;
}

export interface GoalTrackingLog {
  id: number;
  goalId: number;
  checkInTime: Date;
  value: number;
  unit: GoalUnit;
}

export interface UserSettings {
  name: string;
  language: string;
  notifications: boolean;
}

export interface CheckInStatus {
  goalId: number;
  date: string;
  checkedIn: boolean;
  value?: number;
}

// Sample data
export const SAMPLE_GOAL_UNITS: GoalUnit[] = [
  { id: 1, singularName: "time", pluralName: "times" },
  { id: 2, singularName: "day", pluralName: "days" },
  { id: 3, singularName: "page", pluralName: "pages" },
  { id: 4, singularName: "hour", pluralName: "hours" },
  { id: 5, singularName: "minute", pluralName: "minutes" },
];

// Goal colors for individual goal customization
export const DEFAULT_COLORS = [
  "#ff0000", // Red
  "#00ff00", // Green
  "#0000ff", // Blue
  "#ffff00", // Yellow
  "#ff00ff", // Magenta
  "#00ffff", // Cyan
  "#ffa500", // Orange
  "#800080", // Purple
  "#008000", // Dark Green
  "#ffc0cb", // Pink
];

// Updated icon system to use image file names as per requirements
export const DEFAULT_ICONS = [
  "image01.jpg", // Learn/Study
  "image02.jpg", // Fitness/Strength
  "image03.jpg", // Target/Goal
  "image04.jpg", // Running/Exercise
  "image05.jpg", // Brain/Mind
  "image06.jpg", // Work/Career
  "image07.jpg", // Art/Creativity
  "image08.jpg", // Music
  "image09.jpg", // Health/Nutrition
  "image10.jpg", // Ideas/Lightbulb
];

// App UI Color Palette as per requirements
export const APP_COLORS = {
  light: "#F9F5F0", // Light cream - for UI elements
  medium: "#F2EAD3", // Warm beige - for secondary backgrounds
  accent: "#F4991A", // Orange - for highlights and CTAs
  dark: "#344F1F", // Dark green - for text and dark elements
};
