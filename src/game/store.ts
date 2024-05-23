import { useSyncExternalStore } from "react";
import { Debug } from "../game-ui/CheatSheet";
import { Board, Direction, Position, PossibleLines } from "./base";
import {
  solveVerticalLine,
  solveHorizontalLine,
  rankLines,
  solveNextLine,
} from "./solve";

export type NextLines = {
  direction: Direction;
  line: number;
  score: number;
};

export type LineStore = {
  possibleLines: PossibleLines[];
  solvedLines: boolean[];
  size: number;
};

export type State = {
  isSolving: boolean;
  horizontalPositions: Position[];
  verticalPositions: Position[];
  verticalLines: LineStore;
  horizontalLines: LineStore;
  board: Board;
  nextLines: NextLines[];
};

const makeReducerStore = (
  horizontalPositions: Position[],
  verticalPositions: Position[]
) => {
  let store: State = {
    isSolving: false,
    horizontalPositions,
    verticalPositions,
    board: Array(verticalPositions.length)
      .fill(null)
      .map(() => Array(horizontalPositions.length).fill(null)),
    nextLines: [],
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
    solveNextLines: () => {
      let maxIndex = 0;
      store.isSolving = true;
      const loop = () => {
        maxIndex++;
        const [newStore] = solveNextLine(store);
        store = { ...newStore };
        notify();
        if (!store.isSolving) {
          console.log("pawse");
          notify();
          return;
        }
        if (store.nextLines.length === 0) {
          store.isSolving = false;
          console.log("done");
          notify();
          return;
        }
        if (maxIndex > 1000) {
          store.isSolving = false;
          console.log("stacc");
          notify();
          return;
        }
        requestAnimationFrame(loop);
      };
      loop();
    },
    pauseSolving: () => {
      store.isSolving = false;
      notify();
    },
    solveNextLine: (): Debug => {
      const [newStore, debug] = solveNextLine(store);
      store = { ...newStore };
      notify();
      return debug;
    },
    rankLines: () => {
      store = rankLines(store);
      notify();
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
    solveNextLine: STORE.solveNextLine,
    solveNextLines: STORE.solveNextLines,
    pauseSolving: STORE.pauseSolving,
  };
};
