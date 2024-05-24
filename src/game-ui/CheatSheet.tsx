import React from "react";

import stylex from "@stylexjs/stylex";
import Flexbox from "../styles/Flexbox";
import { Item, Line, PossibleLines } from "../game/base";
import { useSolveStore, useSolveStoreActions } from "../store/solve-store";
import { serializePositions } from "../game/url";

export type Debug = {
  verticalPositions?: PossibleLines;
  validRows?: PossibleLines;
  result?: Line;
  currentRow?: Line;
  didAddToSolution?: boolean;
};

const styles = stylex.create({
  root: {
    fontSize: ".3rem",
    background: "#000",
    color: "#fff",
    width: "16rem",
    overflow: "scroll",
    position: "sticky",
    top: 0,
    maxHeight: "100dvh",
  },
});

function Tile({ item }: { item: Item }) {
  if (item === null) {
    return "🌫️";
  }
  if (item === "x") {
    return "❎";
  }
  if (item === "o") {
    return "⭕";
  }
  return item;
}

export function CheatSheet() {
  const state = useSolveStore();
  const {
    debug: { solveDebug },
  } = state;

  const { toggleDebug } = useSolveStoreActions();
  return (
    <div {...stylex.props(styles.root)}>
      <Flexbox gap={8} direction="column">
        <Flexbox>
          <button
            onClick={() => {
              alert(serializePositions(state));
            }}
          >
            Serialize
          </button>
          <button
            onClick={() => {
              toggleDebug(false);
            }}
          >
            Close
          </button>
        </Flexbox>
        <hr />
        {solveDebug ? <SolveCheatSheet solveDebug={solveDebug} /> : null}
      </Flexbox>
    </div>
  );
}

function SolveCheatSheet({ solveDebug }: { solveDebug: Debug }) {
  const { result, verticalPositions, currentRow, didAddToSolution, validRows } =
    solveDebug;
  return (
    <div {...stylex.props(styles.root)}>
      <Flexbox direction="column">
        {result.map((item, index) => (
          <Tile item={item} key={index} />
        ))}
        <hr />
        {currentRow.map((item, index) => (
          <Tile item={item} key={index} />
        ))}

        <hr />
        {didAddToSolution === true ? "added" : null}
        <hr />
        <Flexbox direction="row">
          <div>
            Valid
            <br />
            {validRows.map((row, index) => (
              <div key={index}>
                {row.map((item, index) => (
                  <Tile item={item} key={index} />
                ))}
              </div>
            ))}
          </div>
          <div>
            All
            <br />
            {verticalPositions.map((row, index) => (
              <div key={index}>
                {row.map((item, index) => (
                  <Tile item={item} key={index} />
                ))}
              </div>
            ))}
          </div>
        </Flexbox>
      </Flexbox>
    </div>
  );
}
