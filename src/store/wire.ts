interface StoreWire {
  subscribe: (callback: () => void) => () => void;
  notify: () => void;
}

export const getStoreWire = (): StoreWire => {
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
  return { subscribe, notify };
};
