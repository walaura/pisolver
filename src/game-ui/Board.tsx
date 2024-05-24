import React from "react";
import { useSolveStore, useSolveStoreActions } from "../store/solve-store";

import { Tile } from "./Tile";
import { BoardPosition, BoardPositionSolveStore } from "./BoardPosition";
import { BoardLayout } from "./BoardLayout";

export function Board() {
  const {
    board,
    horizontalPositions,
    verticalPositions,
    verticalLines,
    horizontalLines,
    nextLines,
  } = useSolveStore();
  const { solveLine } = useSolveStoreActions();

  const nextLine = nextLines[0];

  return (
    <BoardLayout
      horizontalLines={horizontalLines.size}
      verticalLines={verticalLines.size}
      drawPosition={(direction, index) => {
        const position = (
          direction === "vertical" ? horizontalPositions : verticalPositions
        )[index];
        const isNext =
          nextLine &&
          direction === nextLine.direction &&
          nextLine.line === index;
        const isSolved = (
          direction === "horizontal" ? horizontalLines : verticalLines
        ).solvedLines[index];

        return (
          <BoardPosition
            key={index}
            onClick={() => {
              solveLine(direction, index);
            }}
            direction={direction}
            position={position}
            state={
              isSolved
                ? BoardPositionSolveStore.Solved
                : isNext
                ? BoardPositionSolveStore.Next
                : null
            }
          />
        );
      }}
      drawTile={(vertical, horizontal) => {
        const item = board[horizontal][vertical];
        return (
          <Tile
            item={item}
            key={`${horizontal}-${vertical}`}
            state={
              (nextLine?.direction === "horizontal" &&
                nextLine.line === horizontal) ||
              (nextLine?.direction === "vertical" && nextLine.line === vertical)
                ? "active"
                : null
            }
          />
        );
      }}
    />
  );
}
