import { createContext, useContext, useRef, useSyncExternalStore } from "react";
import { Debug } from "../game-ui/CheatSheet";
import { Board, Direction, Position, PossibleLines } from "../solver/base";
import { solveLine, rankLines, solveNextLine } from "../solver/solve";
import { getStoreWire } from "./wire";
import React from "react";

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

export type SolveStore = {
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

const makeSolveStore = (
  horizontalPositions: Position[],
  verticalPositions: Position[]
) => {
  let store: SolveStore = {
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
  const { notify, subscribe } = getStoreWire();
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
// http://localhost:1234/solve/5,9-5,7-5,4-5,1-5,1-3,1-1,3,2-3-1,3,2-3,1-5,1-5,1-5,4-5,7-5,9/7,7-6,6-6,6-5,5-5,5-1,1-1,1,1,1-2,1,1,2-3,3-4,4-3,3-3,3-2,1,2-2,3,2-1,7,1

const SolveStoreCtx =
  createContext<React.MutableRefObject<ReturnType<typeof makeSolveStore>>>(
    null
  );

export const useSolveStore = () => {
  return useSyncExternalStore(useContext(SolveStoreCtx).current.subscribe, () =>
    useContext(SolveStoreCtx).current.getStore()
  );
};
export const useSolveStoreActions = () => {
  return {
    ...useContext(SolveStoreCtx).current.actions,
  };
};

export const SolveStoreProvider = ({
  children,
  horizontalPositions,
  verticalPositions,
}: {
  children: React.ReactNode;
  horizontalPositions: Position[];
  verticalPositions: Position[];
}) => {
  const { Provider } = SolveStoreCtx;
  const store = useRef(makeSolveStore(horizontalPositions, verticalPositions));
  return <Provider value={store}>{children}</Provider>;
};
