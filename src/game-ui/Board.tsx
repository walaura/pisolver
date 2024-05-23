import React, { useState } from "react";
import { useStore, useStoreActions } from "../game/store";
import { CheatSheet } from "./CheatSheet";
import stylex from "@stylexjs/stylex";

const pop = stylex.keyframes({
  "0%": { transform: "scale(0)" },
  "75%": { transform: "scale(1.1)" },
  "100%": { transform: "scale(1)" },
});

const styles = stylex.create({
  board: {
    "--tile-size": 30,
  },
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
    background: "linear-gradient(to bottom right, #b3ffab, #12fff7);",
    boxShadow: "0 0 2px lime",
    borderRadius: 2,
    width: "calc(var(--tile-size) - 8px)",
    height: "calc(var(--tile-size) - 8px)",
  },
  numbers: {
    fontSize: ".5rem",
    fontWeight: 900,
    gap: 4,
    cursor: "pointer",
  },
  solvedNumbers: {
    opacity: 0.2,
    pointerEvents: "none",
  },
  rowNumbers: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    width: "calc(var(--tile-size)*2)",
    height: "var(--tile-size)",
    marginRight: 16,
  },
  colNumbers: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "calc(var(--tile-size)*2)",
    width: "var(--tile-size)",
    marginBottom: 16,
  },
  spacer: {
    width: "calc((var(--tile-size)*2) + 16px)",
  },
  pop: {
    display: "flex",
    animationName: pop,
    animationDuration: ".3s",
    animationIterationCount: "1",
    animationTimingFunction: "ease",
  },
});

export function Board() {
  const {
    board,
    horizontalPositions,
    verticalPositions,
    verticalLines,
    horizontalLines,
  } = useStore();
  const { solveHorizontalLine, solveVerticalLine } = useStoreActions();
  const [debug, setDebug] = useState(null);
  return (
    <div {...stylex.props(styles.board)}>
      {debug && <CheatSheet debug={debug} onClose={() => setDebug(null)} />}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div {...stylex.props(styles.spacer)} />
        {horizontalPositions.map((col, index) => (
          <div
            onClick={() => {
              setDebug(solveVerticalLine(index));
            }}
            key={index}
            {...stylex.props(
              styles.colNumbers,
              styles.numbers,
              verticalLines.solvedLines[index] && styles.solvedNumbers
            )}
          >
            {col.map((c, index) => (
              <span key={index}>{c}</span>
            ))}
          </div>
        ))}
      </div>
      {board.map((row, lineIndex) => (
        <div style={{ display: "flex", flexDirection: "row" }} key={lineIndex}>
          <div
            {...stylex.props(
              styles.rowNumbers,
              styles.numbers,
              horizontalLines.solvedLines[lineIndex] && styles.solvedNumbers
            )}
            onClick={() => {
              setDebug(solveHorizontalLine(lineIndex));
            }}
          >
            {verticalPositions[lineIndex].map((c, index) => (
              <span key={index}>{c}</span>
            ))}
          </div>
          {row.map((item, colIndex) => (
            <Tile key={colIndex}>
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
            </Tile>
          ))}
        </div>
      ))}
    </div>
  );
}

const Pop = ({ children }: { children: React.ReactNode }) => (
  <div {...stylex.props(styles.pop)}>{children}</div>
);
const Tile = ({ children }: { children: React.ReactNode }) => (
  <div {...stylex.props(styles.tile)}>
    <div {...stylex.props(styles.tileCorner(0, 0))} />
    <div {...stylex.props(styles.tileCorner(0, 1))} />
    <div {...stylex.props(styles.tileCorner(1, 0))} />
    <div {...stylex.props(styles.tileCorner(1, 1))} />
    {children}
  </div>
);

const SolvedTile = () => <div {...stylex.props(styles.tileSolved)} />;

const Cross = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20px"
    viewBox="0 -960 960 960"
    width="20px"
    fill="#bbb"
  >
    <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
  </svg>
);
