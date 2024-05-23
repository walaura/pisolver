import { useSyncExternalStore } from "react";
import { Debug } from "../game-ui/CheatSheet";
import { Position, State } from "./base";
import { solveRow, solveCol } from "./solve";

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
      size: horizontalPositions.length,
      solvedLines: Array(verticalPositions.length).fill(false),
    },
    horizontalLines: {
      possibleLines: [],
      size: verticalPositions.length,
      solvedLines: Array(horizontalPositions.length).fill(false),
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
    solveRow: (rowIndex: number): Debug => {
      const [newStore, debug] = solveRow(store, rowIndex);
      store = newStore;
      notify();
      return debug;
    },
    solveCol: (colIndex: number): Debug => {
      const [newStore, debug] = solveCol(store, colIndex);
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
    solveRow: STORE.solveRow,
    solveCol: STORE.solveCol,
  };
};
