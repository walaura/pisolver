import { GapList, Position } from "./base";

export interface GapData {
  maxNumberInGap: number;
  count: number;
  freeSpaces: number;
}

export function getPossibleInnerGaps(
  gap: number[],
  position: number,
  maxGapSize: number
): GapList {
  if (!maxGapSize) {
    return [];
  }
  if (position === gap.length) {
    return [gap];
  }
  const results = [gap];
  for (let i = 0; i < maxGapSize; i++) {
    const clone = [...gap];
    clone[position] = maxGapSize - i;
    results.push(...getPossibleInnerGaps(clone, position + 1, maxGapSize));
  }
  return results;
}

export function addPossibleOuterGaps(
  innerGaps: GapList,
  maxSpacesTotal: number
) {
  const outerGaps = [];
  innerGaps.forEach((gap) => {
    const gapSize = gap.reduce((acc, curr) => acc + curr, 0);
    const remainder = maxSpacesTotal - gapSize;
    for (let padLeft = 0; padLeft <= remainder; padLeft++) {
      outerGaps.push([padLeft, ...gap, remainder - padLeft]);
      outerGaps.push([remainder - padLeft, ...gap, padLeft]);
    }
  });
  return outerGaps;
}

export function dedupeGaps(gapList: GapList): GapList {
  return [...new Set(gapList.map((n) => n.join(",")))].map((n) =>
    n.split(",").map(Number)
  );
}

export function getGapDataForPosition(
  position: Position,
  rowLength: number
): GapData {
  const allNumbers = position.reduce((acc, curr) => acc + curr, 0);
  const freeSpaces = rowLength + 1 - allNumbers;
  const count = position.length - 1;

  const maxNumberInGap = rowLength - (allNumbers + (position.length - 3));

  return {
    maxNumberInGap,
    count,
    freeSpaces,
  };
}

export function getGaps({
  count,
  maxNumberInGap,
  freeSpaces,
}: GapData): GapList {
  const innerGaps = dedupeGaps(
    getPossibleInnerGaps(new Array(count).fill(1), 0, maxNumberInGap)
  );
  return dedupeGaps(addPossibleOuterGaps(innerGaps, freeSpaces));
}
