import { title } from "@/components/primitives";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { GoalTrackerStorage } from "./services/storage";
import { APP_COLORS } from "./types";
import { useState, useEffect } from "react";

export default function GoalTrackerApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<
    "morning" | "afternoon" | "evening"
  >("morning");
  const [textColor, setTextColor] = useState("#000000");
  const [secondaryTextColor, setSecondaryTextColor] = useState("#374151");
  const [welcomeMessageColor, setWelcomeMessageColor] = useState(
    "rgba(255, 223, 186, 0.85)"
  );

  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const currentTimeOfDay = GoalTrackerStorage.getTimeOfDay();
      const currentGreeting = GoalTrackerStorage.getGreeting();
      const currentTextColor = GoalTrackerStorage.getTextColor();
      const currentSecondaryTextColor =
        GoalTrackerStorage.getSecondaryTextColor();
      setTimeOfDay(currentTimeOfDay);
      setGreeting(currentGreeting);
      setTextColor(currentTextColor);
      setSecondaryTextColor(currentSecondaryTextColor);
    };

    updateTimeAndGreeting();
    // Update every hour
    const interval = setInterval(updateTimeAndGreeting, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getBackgroundColor = () => {
    return "#FFFFFF"; // Always white background
  };

  const navigationItems = [
    { path: "/goal-tracker", label: "Home", icon: "🏠" },
    { path: "/goal-tracker/new", label: "New Goal", icon: "➕" },
    { path: "/goal-tracker/settings", label: "Settings", icon: "⚙️" },
  ];

  const isActive = (path: string) => {
    if (path === "/goal-tracker") {
      return location.pathname === "/goal-tracker";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {/* Header */}
      <header
        className="backdrop-blur-sm border-b"
        style={{
          backgroundColor: `${APP_COLORS.light}20`,
          borderColor: `${APP_COLORS.dark}30`,
        }}
      >
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h1
                className={title({ size: "sm" })}
                style={{ color: textColor }}
              >
                Goal Tracker
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  color: textColor,
                  backgroundColor: welcomeMessageColor,
                }}
              >
                {greeting}
              </span>
              <button
                className="p-2 rounded-full transition-colors"
                style={{
                  backgroundColor: `${APP_COLORS.accent}20`,
                  color: textColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${APP_COLORS.accent}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${APP_COLORS.accent}20`;
                }}
              >
                <span className="text-lg">❓</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t"
        style={{
          backgroundColor: `${APP_COLORS.light}20`,
          borderColor: `${APP_COLORS.dark}30`,
        }}
      >
        <div className="max-w-md mx-auto">
          <div className="flex">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex-1 flex flex-col items-center py-3 px-2 transition-colors"
                style={{
                  backgroundColor: isActive(item.path)
                    ? `${APP_COLORS.accent}20`
                    : "transparent",
                  color: isActive(item.path) ? textColor : secondaryTextColor,
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = `${APP_COLORS.light}10`;
                    e.currentTarget.style.color = APP_COLORS.dark;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = `${APP_COLORS.dark}70`;
                  }
                }}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
