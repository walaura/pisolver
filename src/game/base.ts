export type Item = null | "x" | "o";
export type Line = Item[];
export type PossibleLines = Line[];
export type Board = Line[];

export type Position = number[];

export type State = {
  cols: Position[];
  rows: Position[];
  colSize: number;
  rowSize: number;
  board: Board;
  possibleCols: PossibleLines[];
  possibleRows: PossibleLines[];
};

export type Gap = number[];
export type GapList = Gap[];
