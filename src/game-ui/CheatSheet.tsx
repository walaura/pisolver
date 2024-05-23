import React from "react";

import stylex from "@stylexjs/stylex";
import Flexbox from "../styles/Flexbox";
import { Item, Line, PossibleLines } from "../game/base";

export type Debug = {
  verticalPositions?: PossibleLines;
  validRows?: PossibleLines;
  result?: Line;
  currentRow?: Line;
  didAddToSolution?: boolean;
};

const styles = stylex.create({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    fontSize: ".3rem",
    background: "#000",
    color: "#fff",
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

export function CheatSheet({
  debug: {
    verticalPositions = [],
    result = [],
    currentRow = [],
    validRows = [],
    didAddToSolution,
  } = {},
  onClose,
}: {
  debug: Debug;
  onClose: () => void;
}) {
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
        <button onClick={onClose}>Close</button>
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
