import { Debug } from "../game-ui/CheatSheet";
import { State } from "./base";
import { getRow, getCol, writeCol, writeRow } from "./board";
import {
  getPossibleLines,
  getValidPossibleLines,
  getCommonItemsAcrossLines,
} from "./lines";

const solveLine =
  (what: "row" | "col") =>
  (store: State, lineIndex: number): [State, Debug] => {
    // backwards on purpose
    const size = what === "row" ? store.colSize : store.rowSize;
    const line = what === "row" ? store.rows[lineIndex] : store.cols[lineIndex];
    const getLine = what === "row" ? getRow : getCol;
    const writeLine = what === "row" ? writeRow : writeCol;
    const maybePossibleLines =
      what === "row" ? store.possibleRows : store.possibleCols;

    let possibleLines = maybePossibleLines[lineIndex];
    if (!possibleLines) {
      console.log("cache miss");
      possibleLines = getPossibleLines(line, size);
    }

    const currentLine = getLine(store.board, lineIndex);
    const validLines = getValidPossibleLines(possibleLines, currentLine);
    const result = getCommonItemsAcrossLines(validLines);

    const debug = {
      rows: possibleLines,
      currentRow: currentLine,
      validRows: validLines,
    };

    if (!result) {
      alert("no");
      return [store, debug];
    }

    maybePossibleLines[lineIndex] = validLines;
    store.board = writeLine(store.board, lineIndex, result);

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
