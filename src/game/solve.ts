import { Debug } from "../game-ui/CheatSheet";
import { Direction, State } from "./base";
import { getRow, getCol, writeCol, writeRow } from "./board";
import {
  getPossibleLines,
  getValidPossibleLines,
  getCommonItemsAcrossLines,
  isLineSolved,
} from "./lines";

// const rankLines = (store: State) => {};

const solveLine =
  (what: Direction) =>
  (store: State, lineIndex: number): [State, Debug] => {
    const lineStore =
      what === "vertical" ? store.verticalLines : store.horizontalLines;
    const size = lineStore.size;
    const position =
      what === "vertical"
        ? store.horizontalPositions[lineIndex]
        : store.verticalPositions[lineIndex];
    const getLine = what === "vertical" ? getCol : getRow;
    const writeLine = what === "vertical" ? writeCol : writeRow;
    const maybePossibleLines = lineStore.possibleLines;
    const solvedLines = lineStore.solvedLines;

    let possibleLines = maybePossibleLines[lineIndex];
    if (!possibleLines) {
      possibleLines = getPossibleLines(position, size);
    }

    const currentLine = getLine(store.board, lineIndex);
    const validLines = getValidPossibleLines(possibleLines, currentLine);
    const result = getCommonItemsAcrossLines(validLines);
    console.log(what, currentLine, result);
    const debug = {
      verticalPositions: possibleLines,
      currentRow: currentLine,
      validRows: validLines,
    };

    if (!result) {
      alert("no");
      return [store, debug];
    }

    maybePossibleLines[lineIndex] = validLines;
    store.board = writeLine(store.board, lineIndex, result);
    if (isLineSolved(result)) {
      solvedLines[lineIndex] = true;
    }

    return [
      store,
      {
        ...debug,
        result,
      },
    ];
  };

export const solveVerticalLine = solveLine("vertical");
export const solveHorizontalLine = solveLine("horizontal");
