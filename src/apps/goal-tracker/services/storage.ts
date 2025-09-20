import {
  Goal,
  GoalUnit,
  GoalTrackingLog,
  UserSettings,
  CheckInStatus,
} from "../types";

const STORAGE_KEYS = {
  GOALS: "goal-tracker-goals",
  GOAL_UNITS: "goal-tracker-goal-units",
  TRACKING_LOGS: "goal-tracker-logs",
  USER_SETTINGS: "goal-tracker-settings",
  CHECK_IN_STATUS: "goal-tracker-check-in-status",
};

export class GoalTrackerStorage {
  // Goals
  static getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static addGoal(goal: Goal): void {
    const goals = this.getGoals();
    goals.push(goal);
    this.saveGoals(goals);
  }

  static updateGoal(goalId: number, updates: Partial<Goal>): void {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === goalId);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates };
      this.saveGoals(goals);
    }
  }

  static deleteGoal(goalId: number): void {
    const goals = this.getGoals().filter((g) => g.id !== goalId);
    this.saveGoals(goals);
  }

  // Goal Units
  static getGoalUnits(): GoalUnit[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOAL_UNITS);
      if (data) {
        return JSON.parse(data);
      }
      // Return default units if none exist
      const defaultUnits = [
        { id: 1, singularName: "time", pluralName: "times" },
        { id: 2, singularName: "day", pluralName: "days" },
        { id: 3, singularName: "page", pluralName: "pages" },
        { id: 4, singularName: "hour", pluralName: "hours" },
        { id: 5, singularName: "minute", pluralName: "minutes" },
      ];
      this.saveGoalUnits(defaultUnits);
      return defaultUnits;
    } catch {
      return [];
    }
  }

  static saveGoalUnits(units: GoalUnit[]): void {
    localStorage.setItem(STORAGE_KEYS.GOAL_UNITS, JSON.stringify(units));
  }

  static addGoalUnit(unit: GoalUnit): void {
    const units = this.getGoalUnits();
    units.push(unit);
    this.saveGoalUnits(units);
  }

  // Tracking Logs
  static getTrackingLogs(): GoalTrackingLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRACKING_LOGS);
      const logs = data ? JSON.parse(data) : [];
      // Convert date strings back to Date objects
      return logs.map((log: any) => ({
        ...log,
        checkInTime: new Date(log.checkInTime),
      }));
    } catch {
      return [];
    }
  }

  static addTrackingLog(log: Omit<GoalTrackingLog, "id">): void {
    const logs = this.getTrackingLogs();
    const newLog: GoalTrackingLog = {
      ...log,
      id: Date.now(), // Simple ID generation
    };
    logs.push(newLog);
    localStorage.setItem(STORAGE_KEYS.TRACKING_LOGS, JSON.stringify(logs));
  }

  static getLogsForGoal(goalId: number): GoalTrackingLog[] {
    return this.getTrackingLogs().filter((log) => log.goalId === goalId);
  }

  // User Settings
  static getUserSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (data) {
        const parsedData = JSON.parse(data);

        // Migrate old settings format to new format
        if (
          parsedData.morningBackground ||
          parsedData.afternoonBackground ||
          parsedData.eveningBackground
        ) {
          const migratedSettings: UserSettings = {
            name: parsedData.name || "",
            language: parsedData.language || "en",
            notifications:
              parsedData.notifications !== undefined
                ? parsedData.notifications
                : true,
          };
          this.saveUserSettings(migratedSettings);
          return migratedSettings;
        }

        return parsedData;
      }
    } catch (error) {
      // Error parsing user settings, will use defaults
    }

    // Return default settings
    const defaultSettings: UserSettings = {
      name: "",
      language: "en",
      notifications: true,
    };
    this.saveUserSettings(defaultSettings);
    return defaultSettings;
  }

  static saveUserSettings(settings: UserSettings): void {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  }

  // Check-in Status
  static getCheckInStatus(): CheckInStatus[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECK_IN_STATUS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static updateCheckInStatus(
    goalId: number,
    date: string,
    checkedIn: boolean,
    value?: number
  ): void {
    const statuses = this.getCheckInStatus();
    const existingIndex = statuses.findIndex(
      (s) => s.goalId === goalId && s.date === date
    );

    const status: CheckInStatus = { goalId, date, checkedIn, value };

    if (existingIndex !== -1) {
      statuses[existingIndex] = status;
    } else {
      statuses.push(status);
    }

    localStorage.setItem(
      STORAGE_KEYS.CHECK_IN_STATUS,
      JSON.stringify(statuses)
    );
  }

  static isCheckedInToday(goalId: number): boolean {
    const today = new Date().toDateString();
    const status = this.getCheckInStatus().find(
      (s) => s.goalId === goalId && s.date === today
    );
    return status?.checkedIn || false;
  }

  // Utility methods
  static resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  static getTimeOfDay(): "morning" | "afternoon" | "evening" {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  static getGreeting(): string {
    const timeOfDay = this.getTimeOfDay();
    const greetings = {
      morning: "Good Morning",
      afternoon: "Good Afternoon",
      evening: "Good Evening",
    };
    return greetings[timeOfDay];
  }

  static getTextColor(): string {
    return "#000000"; // Black text for white background
  }

  static getSecondaryTextColor(): string {
    return "#374151"; // Dark gray for white background
  }

  static getWelcomeMessageColor(): string {
    const timeOfDay = this.getTimeOfDay();
    const welcomeColors = {
      morning: "rgba(255, 223, 186, 0.85)", // Soft peach - elegant morning warmth
      afternoon: "rgba(173, 216, 230, 0.80)", // Light sky blue - clear afternoon light
      evening: "rgba(240, 248, 255, 0.75)", // Ghost white - elegant evening mist
    };
    return welcomeColors[timeOfDay];
  }
}
