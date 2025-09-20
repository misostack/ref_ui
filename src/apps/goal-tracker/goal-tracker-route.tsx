import GoalTrackerApp from "./goal-tracker-app";
import GoalDetails from "./pages/goal-details";
import GoalTrackerHome from "./pages/home";
import NewGoal from "./pages/new-goal";
import GoalTrackerSettings from "./pages/settings";

const routes = {
  path: "/goal-tracker",
  component: GoalTrackerApp,
  element: <GoalTrackerApp />,
  children: [
    {
      index: true,
      element: <GoalTrackerHome />,
    },
    {
      path: "goal/:id",
      element: <GoalDetails />,
    },
    {
      path: "new",
      element: <NewGoal />,
    },
    {
      path: "settings",
      element: <GoalTrackerSettings />,
    },
  ],
};
export default routes;
