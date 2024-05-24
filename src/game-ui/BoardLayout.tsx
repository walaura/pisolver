import React, { useMemo } from "react";

import stylex from "@stylexjs/stylex";
import { Direction } from "../game/base";
import Flexbox from "../styles/Flexbox";

const styles = stylex.create({
  board: {
    "--tile-size": 30,
    "--position-size": 60,
    "--spacing": "1rem",
    marginRight: "calc(var(--position-size) + var(--spacing))",
    marginBottom: "calc(var(--position-size) + var(--spacing))",
  },
  spacer: {
    width: "calc(var(--position-size) + var(--spacing))",
  },
  bottomMargin: {
    marginBottom: "var(--spacing)",
  },
  endMargin: {
    marginEnd: "var(--spacing)",
  },
});

export function BoardLayout({
  horizontalLines,
  verticalLines,
  drawTile,
  drawPosition,
}: {
  horizontalLines: number;
  verticalLines: number;
  drawTile: (horizontal: number, vertical: number) => React.ReactElement;
  drawPosition: (direction: Direction, index: number) => React.ReactElement;
}) {
  const horizontalLinesArray = useMemo(
    () => Array.from({ length: horizontalLines }).fill(null),
    [horizontalLines]
  );
  const verticalLinesArray = useMemo(
    () => Array.from({ length: verticalLines }).fill(null),
    [verticalLines]
  );
  return (
    <div {...stylex.props(styles.board)}>
      <Flexbox direction="row" styles={styles.bottomMargin}>
        <div {...stylex.props(styles.spacer)} />
        {horizontalLinesArray.map((_, index) =>
          drawPosition("vertical", index)
        )}
      </Flexbox>
      {verticalLinesArray.map((_, verticalIndex) => (
        <Flexbox direction="row" key={verticalIndex}>
          <Flexbox styles={styles.endMargin}>
            {drawPosition("horizontal", verticalIndex)}
          </Flexbox>
          {horizontalLinesArray.map((_, horizontalIndex) =>
            drawTile(horizontalIndex, verticalIndex)
          )}
        </Flexbox>
      ))}
    </div>
  );
}
