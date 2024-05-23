import { Board, Direction, Line } from "./base";

export function getCol(board: Board, colIndex: number): Line {
  return board.map((row) => row[colIndex]);
}

export function getRow(board: Board, rowIndex: number): Line {
  return board[rowIndex];
}

export const getLine = (direction: Direction) =>
  direction === "vertical" ? getCol : getRow;

export function writeRow(board: Board, rowIndex: number, row: Line): Board {
  board[rowIndex] = row;
  return board;
}

export function writeCol(board: Board, colIndex: number, col: Line): Board {
  return board.map((row, index) => {
    row[colIndex] = col[index];
    return row;
  });
}
