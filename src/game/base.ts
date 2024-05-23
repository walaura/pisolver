export type Item = null | "x" | "o";
export type Line = Item[];
export type PossibleLines = Line[];
export type Board = Line[];

export type Position = number[];

export type LineStore = {
  possibleLines: PossibleLines[];
  solvedLines: boolean[];
  size: number;
};

export type State = {
  horizontalPositions: Position[];
  verticalPositions: Position[];
  board: Board;
  verticalLines: LineStore;
  horizontalLines: LineStore;
};

export type Gap = number[];
export type GapList = Gap[];
