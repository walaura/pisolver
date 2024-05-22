import React from "react";
import { Tile } from "./Tile";
import { PossibleRows, Row } from "../game/base";
import stylex from "@stylexjs/stylex";
import Flexbox from "../styles/Flexbox";

export type Debug = {
  rows?: PossibleRows;
  validRows?: PossibleRows;
  result?: Row;
  currentRow?: Row;
};

const styles = stylex.create({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    border: "2px solid #ddd",
  },
});

export function CheatSheet({
  debug: { rows = [], result = [], currentRow = [], validRows = [] } = {},
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
            {rows.map((row, index) => (
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
