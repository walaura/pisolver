import React, { useMemo, useSyncExternalStore } from "react";
import Flexbox from "./styles/Flexbox";
import stylex from "@stylexjs/stylex";

const appStyles = stylex.create({
  center: {
    minWidth: "100vh",
    minHeight: "90vh",
  },
});

const BOARD = [10, 10];

type ItemKey = number;

interface Placeable {
  id: ItemKey;
}

type Item =
  | (Placeable & {
      type: "resource";
      points: number;
    })
  | (Placeable & {
      type: "glorper";
      nextGlorp: number;
    });

type State = {
  score: number;
  positions: { [key: ItemKey]: [x: number, y: number] };
  items: { [key: ItemKey]: Item };
};

type Action =
  | { type: "LOOP"; frameTime: number }
  | { type: "SUBSTRACT"; itemKey: ItemKey };

const reducer: (_state: State, action: Action) => State = (_state, action) => {
  let state = _state;
  const mutateItem = <I,>(itemKey: ItemKey, item: Partial<I>): State => {
    return {
      ...state,
      items: {
        ...state.items,
        [itemKey]: {
          ...state.items[itemKey],
          ...item,
        },
      },
    };
  };
  switch (action.type) {
    case "LOOP": {
      for (const item of Object.values(state.items)) {
        if (item.type === "glorper") {
          const nextGlorp = item.nextGlorp - action.frameTime;
          if (nextGlorp > 0) {
            state = mutateItem(item.id, { nextGlorp });
          } else {
            state = mutateItem(item.id, { nextGlorp: 1000 });
          }
        }
      }
      return state;
    }
    case "SUBSTRACT": {
      const item = state.items[action.itemKey];
      if (item.type !== "resource") {
        return state;
      }
      return mutateItem(item.id, { points: item.points - 1 });
    }
  }
};

const makeReducerStore = () => {
  let store: State = {
    score: 0,
    positions: {
      1: [4, 4],
      2: [4, 3],
    },
    items: {
      1: {
        id: 1,
        type: "resource",
        points: 30,
      },
      2: {
        id: 2,
        type: "glorper",
        nextGlorp: 1000,
      },
    },
  };

  const subs = new Set<() => void>();

  const subscribe = (callback) => {
    subs.add(callback);
    console.log(subs.size);
    return () => {
      subs.delete(callback);
    };
  };
  const notify = () => {
    subs.forEach((sub) => sub());
  };
  const dispatch = (action: Action) => {
    store = reducer(store, action);
    notify();
  };
  const getStore = () => store;
  const getSelector = <T,>(selector: (Store) => T) => selector(store);
  const getItem = (key: ItemKey): Item => store.items[key];

  let lastTimestamp = performance.now();
  const loop = (time) => {
    const frameTime = time - lastTimestamp;
    lastTimestamp = time;
    dispatch({ type: "LOOP", frameTime });
    requestAnimationFrame(loop);
  };
  loop(lastTimestamp);

  return {
    getStore,
    getItem,
    getSelector,
    dispatch,
    subscribe,
  };
};

const STORE = makeReducerStore();

const useGetStoreDispatch = () => {
  return STORE.dispatch;
};
const useStorePositions = () => {
  return useSyncExternalStore(
    STORE.subscribe,
    () => STORE.getStore().positions
  );
};
const useStoreItem = (key: ItemKey) => {
  return useSyncExternalStore(STORE.subscribe, () => STORE.getItem(key));
};

function Tile({ itemKey }: { itemKey: ItemKey }) {
  const dispatch = useGetStoreDispatch();
  const item = useStoreItem(itemKey);
  if (item.type === "glorper") {
    return <>🐿️ -{item.nextGlorp}</>;
  }
  if (item.type === "resource") {
    return (
      <button
        onClick={() => {
          dispatch({ type: "SUBSTRACT", itemKey: item.id });
        }}
      >
        {item.points}
      </button>
    );
  }
}

function Board() {
  const [xItems, yItems] = useMemo(
    () => [
      Array.from(Array(BOARD[0]).keys()),
      Array.from(Array(BOARD[1]).keys()),
    ],
    []
  );
  const locations = useMemo<(ItemKey | null)[][]>(
    () => xItems.map(() => [...yItems].map(() => null)),
    [xItems, yItems]
  );

  const positions = useStorePositions();

  Object.entries(positions).forEach(([itemKey, [x, y]]) => {
    locations[x][y] = itemKey as unknown as number;
  });

  return yItems.map((y) => (
    <div style={{ display: "flex", flexDirection: "column" }} key={y}>
      {xItems.map((x) => (
        <div
          key={x}
          style={{ width: 50, height: 50, border: "1px solid #ddd" }}
        >
          {locations[x][y] ? <Tile itemKey={locations[x][y]} /> : null}
        </div>
      ))}
    </div>
  ));
}

export default function App() {
  return (
    <Flexbox styles={appStyles.center} align="center" justify="center">
      <Board />
    </Flexbox>
  );
}
