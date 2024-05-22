import { Gap, GapList, Position, Line } from "./base";
import { getGapDataForPosition, getGaps } from "./gaps";

export function getPossibleLines(position: Position, size: number): Line[] {
  const gapData = getGapDataForPosition(position, size - 1);

  const gaps = getGaps(gapData);
  const results = makePossibleLinesWithGaps(gaps, position);

  return results;
}

export const getValidPossibleLines = (
  rows: Line[],
  currentLine: Line
): Line[] => {
  return rows.filter((row) => {
    return row.every((item, index) => {
      return currentLine[index] === null || item === currentLine[index];
    });
  });
};

export function getCommonItemsAcrossLines(allLines: Line[]): Line | null {
  if (allLines.length === 0) return null;
  const sharedLine = [];
  for (let i = 0; i < allLines[0].length; i++) {
    const item = allLines[0][i];
    if (allLines.every((row) => row[i] === item)) {
      sharedLine.push(item);
    } else {
      sharedLine.push(null);
    }
  }
  return sharedLine;
}

export function makePossibleLinesWithGaps(outerGaps: GapList, row: Position) {
  function makeLine(gap: Gap, row: Position) {
    const result = [];
    gap.forEach((space, index) => {
      for (let i = 0; i < space; i++) {
        result.push("o");
      }
      for (let ii = 0; ii < row[index]; ii++) {
        result.push("x");
      }
    });
    return result;
  }

  const results = [];
  outerGaps.forEach((gap) => {
    results.push(makeLine(gap, row));
  });
  return results;
}
