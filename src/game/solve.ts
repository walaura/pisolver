import { Debug } from "../game-ui/CheatSheet";
import { State } from "./base";
import { getRow, getCol, writeCol, writeRow } from "./board";
import {
  getPossibleLines,
  getValidPossibleLines,
  getCommonItemsAcrossLines,
  isLineSolved,
} from "./lines";

// const rankLines = (store: State) => {};

const solveLine =
  (what: "row" | "col") =>
  (store: State, lineIndex: number): [State, Debug] => {
    const lineStore =
      what === "row" ? store.verticalLines : store.horizontalLines;
    const size = lineStore.size;
    const line =
      what === "row"
        ? store.verticalPositions[lineIndex]
        : store.horizontalPositions[lineIndex];
    const getLine = what === "row" ? getRow : getCol;
    const writeLine = what === "row" ? writeRow : writeCol;
    const maybePossibleLines = lineStore.possibleLines;
    const solvedLines = lineStore.solvedLines;

    let possibleLines = maybePossibleLines[lineIndex];
    if (!possibleLines) {
      console.log("cache miss");
      possibleLines = getPossibleLines(line, size);
    }

    const currentLine = getLine(store.board, lineIndex);
    const validLines = getValidPossibleLines(possibleLines, currentLine);
    const result = getCommonItemsAcrossLines(validLines);
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

export const solveRow = solveLine("row");
export const solveCol = solveLine("col");
