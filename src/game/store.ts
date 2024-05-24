import { useSyncExternalStore } from "react";
import { Debug } from "../game-ui/CheatSheet";
import { Board, Direction, Position, PossibleLines } from "./base";
import { solveLine, rankLines, solveNextLine } from "./solve";
import { deserializePositions } from "./url";

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
  debug: {
    shouldDebug: boolean;
    solveDebug: null | Debug;
  };
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
    debug: {
      shouldDebug: false,
      solveDebug: null,
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

  const actions = {
    solveLine: (direction: Direction, rowIndex: number) => {
      const [newStore, solveDebug] = solveLine(direction)(store, rowIndex);
      store = { ...newStore };
      if (store.debug.shouldDebug) {
        store.debug = {
          ...store.debug,
          solveDebug,
        };
      }
      notify();
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
    solveNextLine: () => {
      const [newStore, solveDebug] = solveNextLine(store);
      store = { ...newStore };
      if (store.debug.shouldDebug) {
        store.debug = {
          ...store.debug,
          solveDebug,
        };
      }
      notify();
    },
    rankLines: () => {
      store = rankLines(store);
      notify();
    },
    toggleDebug: (to?: boolean) => {
      store = {
        ...store,
        debug: {
          ...store.debug,
          shouldDebug: to === undefined ? !store.debug.shouldDebug : to,
        },
      };
      notify();
    },
  };

  return {
    getStore,
    subscribe,
    actions,
  };
};

// [[1, 2], [1, 1], [0], [1, 1], [1, 2]],
// [[1, 1], [0], [1, 1], [1, 1], [2, 2]]

// http://localhost:1234/solve/3-1,1-7,1,2-9,1,2-9,5-9,1,2-7,1,2-1,1-3/3-5-5-5-5-1,5,1-1,5,1-1,5,1-1,3,1-1,1-3-1-1-5-7
// http://localhost:1234/solve/1,2-1,1-0-1,1-1,2/1,1-0-1,1-1,1-2,2

const base = (window.location?.pathname ?? "")
  .split("/")
  .filter(Boolean)
  .slice(1);
console.log(base);
const prep: [Position[], Position[]] =
  base.length === 2
    ? deserializePositions(base[0], base[1])
    : [
        [[1, 2], [1, 1], [0], [1, 1], [1, 2]],
        [[1, 1], [0], [1, 1], [1, 1], [2, 2]],
      ];

const STORE = makeReducerStore(...prep);
export const useStore = () => {
  return useSyncExternalStore(STORE.subscribe, () => STORE.getStore());
};
export const useStoreActions = () => {
  return {
    ...STORE.actions,
  };
};
