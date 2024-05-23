export type Item = null | "x" | "o";
export type Line = Item[];
export type PossibleLines = Line[];
export type Board = Line[];

export type Position = number[];

export type Direction = "horizontal" | "vertical";

export type NextLines = {
  direction: Direction;
  line: number;
};

export type LineStore = {
  possibleLines: PossibleLines[];
  solvedLines: boolean[];
  size: number;
};

export type State = {
  horizontalPositions: Position[];
  verticalPositions: Position[];
  verticalLines: LineStore;
  horizontalLines: LineStore;
  board: Board;
};

export type Gap = number[];
export type GapList = Gap[];
