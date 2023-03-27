import type { RouteLinksTypeT } from "../types";

export const RouteLinks: RouteLinksTypeT[] = [
  {
    path: "/Students/all",
    component: "Students",
    name: "Students",
    display: true,
  },
  {
    path: "/Teachers/all",
    component: "Teachers",
    name: "Teachers",
    display: true,
  },
];
