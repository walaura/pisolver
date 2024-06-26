import stylex from "@stylexjs/stylex";
import React from "react";
import { Item } from "../solver/base";

const pop = stylex.keyframes({
  "0%": { transform: "scale(0)" },
  "75%": { transform: "scale(1.1)" },
  "100%": { transform: "scale(1)" },
});

const styles = stylex.create({
  tile: {
    width: "calc(var(--tile-size) )",
    height: "calc(var(--tile-size))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    position: "relative",
  },
  tileCorner: (top, left) => ({
    position: "absolute",
    width: 2,
    height: 2,
    borderRadius: "100%",
    background: "#ddd",
    top: top ? -1 : null,
    bottom: top ? null : -1,
    left: left ? -1 : null,
    right: left ? null : -1,
  }),
  tileSolved: {
    background: "var(--accent) linear-gradient(to bottom right, black, #666);",
    backgroundBlendMode: "color-burn",
    boxShadow: "0 0 8px color-mix(in srgb, var(--accent) 50%, transparent)",
    borderRadius: 2,
    width: "calc(var(--tile-size) - 8px)",
    height: "calc(var(--tile-size) - 8px)",
    zIndex: 10,
    overflow: "hidden",
  },
  tileActive: {
    background: "#000",
    opacity: 0.04,
    borderRadius: 2,
    width: "calc(var(--tile-size) - 8px)",
    height: "calc(var(--tile-size) - 8px)",
    margin: "auto",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
  pop: {
    display: "flex",
    animationName: pop,
    animationDuration: ".3s",
    animationIterationCount: "1",
    animationTimingFunction: "ease",
  },
});

const Pop = ({ children }: { children: React.ReactNode }) => (
  <div {...stylex.props(styles.pop)}>{children}</div>
);

export const Tile = ({
  state,
  item,
}: {
  state?: "active" | "solved";
  item?: Item;
}) => (
  <div {...stylex.props(styles.tile)}>
    <div {...stylex.props(styles.tileCorner(0, 0))} />
    <div {...stylex.props(styles.tileCorner(0, 1))} />
    <div {...stylex.props(styles.tileCorner(1, 0))} />
    <div {...stylex.props(styles.tileCorner(1, 1))} />
    {state === "active" ? <div {...stylex.props(styles.tileActive)} /> : null}
    {item === "o" && (
      <Pop>
        <Cross />
      </Pop>
    )}
    {item === "x" && (
      <Pop>
        <SolvedTile />
      </Pop>
    )}
  </div>
);

const SolvedTile = () => <div {...stylex.props(styles.tileSolved)} />;

const Cross = () => (
  <svg height="20px" viewBox="0 -960 960 960" width="20px" fill="#bbb">
    <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
  </svg>
);
