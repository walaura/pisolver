import { Debug } from "../game-ui/CheatSheet";
import { Direction } from "./base";
import { writeCol, writeRow, getLine } from "./board";
import { getGapDataForPosition } from "./gaps";
import {
  getPossibleLines,
  getValidPossibleLines,
  getCommonItemsAcrossLines,
  isLineSolved,
  doLinesMatch,
  getSolvedLineItems,
} from "./line";
import { NextLines, State } from "./store";

export function solveNextLine(store: State): [State, Debug] {
  if (!store.nextLines.length) {
    store = rankLines(store);
  }
  const nextLine = store.nextLines.shift();
  if (!nextLine) {
    return [store, {}];
  }
  return solveLine(nextLine.direction)(store, nextLine.line);
}

export const rankLines = (store: State): State => {
  let nextLines: NextLines[] = [];
  for (let line = 0; line < store.horizontalPositions.length; line++) {
    const { freeSpaces: score } = getGapDataForPosition(
      store.horizontalPositions[line],
      store.verticalLines.size
    );
    nextLines.push({
      direction: "vertical",
      line,
      score,
    });
  }
  for (let line = 0; line < store.verticalPositions.length; line++) {
    const { freeSpaces: score } = getGapDataForPosition(
      store.verticalPositions[line],
      store.horizontalLines.size
    );
    nextLines.push({
      direction: "horizontal",
      line,
      score,
    });
  }

  nextLines = nextLines.filter((lineRef) => {
    const lineStore =
      lineRef.direction === "vertical"
        ? store.verticalLines
        : store.horizontalLines;
    if (lineStore.solvedLines[lineRef.line] === true) {
      return false;
    }
    return true;
  });
  nextLines = nextLines.map((lineRef) => {
    const line = getLine(lineRef.direction)(store.board, lineRef.line);
    lineRef.score += getSolvedLineItems(line);
    return lineRef;
  });
  nextLines = nextLines.sort((a, b) => a.score - b.score);

  store.nextLines = nextLines;
  return store;
};

export const solveLine =
  (what: Direction) =>
  (store: State, lineIndex: number): [State, Debug] => {
    const lineStore =
      what === "vertical" ? store.verticalLines : store.horizontalLines;
    const size = lineStore.size;
    const position =
      what === "vertical"
        ? store.horizontalPositions[lineIndex]
        : store.verticalPositions[lineIndex];
    const writeLine = what === "vertical" ? writeCol : writeRow;
    const maybePossibleLines = lineStore.possibleLines;
    const solvedLines = lineStore.solvedLines;

    let possibleLines = maybePossibleLines[lineIndex];
    if (!possibleLines) {
      possibleLines = getPossibleLines(position, size);
    }

    const currentLine = getLine(what)(store.board, lineIndex);
    const validLines = getValidPossibleLines(possibleLines, currentLine);
    const result = getCommonItemsAcrossLines(validLines);

    const debug = {
      didAddToSolution: false,
      verticalPositions: possibleLines,
      currentRow: currentLine,
      validRows: validLines,
    };

    if (!result) {
      alert("no");
      return [store, debug];
    }

    maybePossibleLines[lineIndex] = validLines;
    const didAddToSolution = !doLinesMatch(currentLine, result);
    store.board = writeLine(store.board, lineIndex, result);
    if (isLineSolved(result)) {
      solvedLines[lineIndex] = true;
    }

    if (didAddToSolution) {
      store = rankLines(store);
    }

    return [
      store,
      {
        ...debug,
        didAddToSolution,
        result,
      },
    ];
  };
