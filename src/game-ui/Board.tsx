import React, { useState, useTransition } from "react";
import { useStore, useStoreActions } from "../game/store";
import { CheatSheet } from "./CheatSheet";
import stylex from "@stylexjs/stylex";
import { Tile } from "./Tile";

const styles = stylex.create({
  board: {
    "--tile-size": 30,
    marginRight: "calc((var(--tile-size)*2) + 16px)",
    marginBottom: "calc((var(--tile-size)*2) + 16px)",
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
  nextNumber: {
    color: "blue",
  },
});

export function Board() {
  const {
    board,
    horizontalPositions,
    verticalPositions,
    verticalLines,
    horizontalLines,
    nextLines,
    isSolving,
  } = useStore();
  const {
    solveHorizontalLine,
    solveVerticalLine,
    solveNextLines,
    pauseSolving,
  } = useStoreActions();
  const [debug, setDebug] = useState(null);

  const nextLine = nextLines[0];
  const [, startTransition] = useTransition();
  return (
    <div {...stylex.props(styles.board)}>
      {isSolving ? (
        <button
          onClick={() => {
            pauseSolving();
          }}
        >
          stop
        </button>
      ) : (
        <button
          onClick={() => {
            startTransition(() => {
              solveNextLines();
            });
          }}
        >
          Rank
        </button>
      )}
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
              verticalLines.solvedLines[index] && styles.solvedNumbers,
              nextLine?.direction === "vertical" &&
                nextLine.line === index &&
                styles.nextNumber
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
              horizontalLines.solvedLines[lineIndex] && styles.solvedNumbers,
              nextLine?.direction === "horizontal" &&
                nextLine.line === lineIndex &&
                styles.nextNumber
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
            <Tile
              item={item}
              key={colIndex}
              state={
                (nextLine?.direction === "horizontal" &&
                  nextLine.line === lineIndex) ||
                (nextLine?.direction === "vertical" &&
                  nextLine.line === colIndex)
                  ? "active"
                  : null
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
