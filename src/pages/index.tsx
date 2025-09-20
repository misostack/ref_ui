import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { NavLink } from "react-router-dom";

const APPS = [
  {
    name: "Goal Tracker",
    description: "A simple goal tracker app",
    href: "/goal-tracker",
  },
];

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {APPS.map((app) => (
          <NavLink key={app.name} to={app.href}>
            <Card>
              <CardHeader className="text-2xl font-bold">{app.name}</CardHeader>
              <CardBody>{app.description}</CardBody>
            </Card>
          </NavLink>
        ))}
      </div>
    </DefaultLayout>
  );
}
