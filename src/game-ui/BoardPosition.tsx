import stylex from "@stylexjs/stylex";
import React from "react";

import { Direction, Position } from "../game/base";

const styles = stylex.create({
  position: {
    fontSize: ".5rem",
    fontWeight: 900,
    gap: 4,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  isSolved: {
    opacity: 0.2,
    pointerEvents: "none",
  },
  isNext: {
    color: "var(--accent)",
  },
});

const directionStyles = stylex.create({
  horizontal: {
    width: "var(--position-size)",
    height: "var(--tile-size)",
  },
  vertical: {
    flexDirection: "column",
    height: "var(--position-size)",
    width: "var(--tile-size)",
  },
});

export enum BoardPositionSolveStore {
  Solved,
  Next,
}

export function BoardPosition({
  onClick,
  state,
  position,
  direction,
}: {
  onClick: () => void;
  state: BoardPositionSolveStore | null;
  position: Position;
  direction: Direction;
}) {
  return (
    <div
      onClick={onClick}
      {...stylex.props(
        directionStyles[direction],
        styles.position,
        state === BoardPositionSolveStore.Solved && styles.isSolved,
        state === BoardPositionSolveStore.Next && styles.isNext
      )}
    >
      {position.map((c, index) => (
        <span key={index}>{c}</span>
      ))}
    </div>
  );
}
