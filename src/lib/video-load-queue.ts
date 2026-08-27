const MAX_CONCURRENT = 2;

type Waiter = {
  resolve: () => void;
  cancelled: boolean;
};

let active = 0;
const waiters: Waiter[] = [];

function grant(resolve: () => void) {
  active += 1;
  resolve();
}

function flushQueue() {
  while (waiters.length > 0 && active < MAX_CONCURRENT) {
    const next = waiters.shift();
    if (!next || next.cancelled) continue;
    grant(next.resolve);
    return;
  }
}

/** Reserve one of the two global video-download slots. */
export function acquireVideoSlot(): { promise: Promise<void>; cancel: () => void } {
  let waiter: Waiter | undefined;

  const promise = new Promise<void>((resolve) => {
    if (active < MAX_CONCURRENT) {
      grant(resolve);
      return;
    }

    waiter = { resolve, cancelled: false };
    waiters.push(waiter);
  });

  return {
    promise,
    cancel: () => {
      if (!waiter || waiter.cancelled) return;
      waiter.cancelled = true;
      const index = waiters.indexOf(waiter);
      if (index >= 0) waiters.splice(index, 1);
    },
  };
}

/** Release a slot so the next waiting video can start loading. */
export function releaseVideoSlot() {
  if (active > 0) active -= 1;
  flushQueue();
}
