import { useState } from "react";
import { deserializePositions } from "./solver/url";

export type SolveRoute = {
  route: "solve";
  horizontalPositions;
  verticalPositions;
};

export type Route =
  | SolveRoute
  | {
      route: "home";
    };

const resolveRoute = (path: string): Route => {
  if (!path) {
    return { route: "home" };
  }

  const base = path.split("/").filter(Boolean).slice(1);
  const prep = base.length === 2 ? deserializePositions(base[0], base[1]) : [];
  if (prep.length === 2) {
    return {
      route: "solve",
      horizontalPositions: prep[0],
      verticalPositions: prep[1],
    };
  }

  return { route: "home" };
};

export const useRouter = () => {
  const initialRoute = resolveRoute(window.location?.pathname);

  const [route] = useState<Route>(initialRoute);
  return route;
};
