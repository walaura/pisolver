import React from "react";
import stylex from "@stylexjs/stylex";
import { useRouter } from "./useRouter";
import SolveRoute from "./route/solve-route";
import SetupRoute from "./route/setup-route";

const styles = stylex.create({
  root: (tokens: { accent: string }) => ({
    display: "flex",
    minHeight: "100dvh",
    "--accent": tokens.accent ?? "#12fff7",
    "--active": "var(--accent)",
  }),
  center: {
    width: "100%",
    flex: "1 0 0",
    display: "flex",
    alignItems: "center",
  },
  toolbar: {
    position: "absolute",
    bottom: "2em",
    left: "2em",
    right: "2em",
  },
});

export default function App() {
  const route = useRouter();
  console.log(route);
  return (
    <div {...stylex.props(styles.root({ accent: "#12fff7" }))}>
      {route.route === "solve" ? <SolveRoute route={route} /> : null}
      {route.route === "home" ? <SetupRoute /> : null}
    </div>
  );
}
