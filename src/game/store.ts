import { useSyncExternalStore } from "react";
import { Debug } from "../game-ui/CheatSheet";
import { Position, State } from "./base";
import { solveVerticalLine, solveHorizontalLine } from "./solve";

const makeReducerStore = (
  horizontalPositions: Position[],
  verticalPositions: Position[]
) => {
  let store: State = {
    horizontalPositions,
    verticalPositions,
    board: Array(verticalPositions.length)
      .fill(null)
      .map(() => Array(horizontalPositions.length).fill(null)),
    verticalLines: {
      possibleLines: [],
      size: verticalPositions.length,
      solvedLines: Array(horizontalPositions.length).fill(false),
    },
    horizontalLines: {
      possibleLines: [],
      size: horizontalPositions.length,
      solvedLines: Array(verticalPositions.length).fill(false),
    },
  };

  const subs = new Set<() => void>();

  const subscribe = (callback) => {
    subs.add(callback);
    return () => {
      subs.delete(callback);
    };
  };
  const notify = () => {
    subs.forEach((sub) => sub());
  };
  const getStore = () => store;

  return {
    getStore,
    subscribe,
    solveVerticalLine: (rowIndex: number): Debug => {
      const [newStore, debug] = solveVerticalLine(store, rowIndex);
      store = newStore;
      notify();
      return debug;
    },
    solveHorizontalLine: (colIndex: number): Debug => {
      const [newStore, debug] = solveHorizontalLine(store, colIndex);
      store = newStore;
      notify();
      return debug;
    },
  };
};

// [[1, 2], [1, 1], [0], [1, 1], [1, 2]],
// [[1, 1], [0], [1, 1], [1, 1], [2, 2]]

const STORE = makeReducerStore(
  [
    [3],
    [1, 1],
    [7, 1, 2],
    [9, 1, 2],
    [9, 5],
    [9, 1, 2],
    [7, 1, 2],
    [1, 1],
    [3],
  ],
  [
    [3],
    [5],
    [5],
    [5],
    [5],
    [1, 5, 1],
    [1, 5, 1],
    [1, 5, 1],
    [1, 3, 1],
    [1, 1],
    [3],
    [1],
    [1],
    [5],
    [7],
  ]
);
export const useStore = () => {
  return useSyncExternalStore(STORE.subscribe, () => STORE.getStore());
};
export const useStoreActions = () => {
  return {
    solveVerticalLine: STORE.solveVerticalLine,
    solveHorizontalLine: STORE.solveHorizontalLine,
  };
};
