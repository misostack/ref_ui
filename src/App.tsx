import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import goalTrackerRoute from "@/apps/goal-tracker/goal-tracker-route";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route
        path={goalTrackerRoute.path}
        element={<goalTrackerRoute.component />}
      >
        {goalTrackerRoute.children?.map((child, index) =>
          child.index ? (
            <Route key="index" index element={child.element} />
          ) : (
            <Route
              key={child.path || index}
              path={child.path}
              element={child.element}
            />
          )
        )}
      </Route>
    </Routes>
  );
}

export default App;
