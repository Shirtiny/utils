type Subscriber = () => void;

// The currently running effect, if any.
let currentSubscriber: Subscriber | null = null;

/**
 * A reactive container for a value.
 */
export interface Signal<T> {
  value: T;
}

/**
 * Creates a new Signal with an initial value.
 * @param value The initial value.
 * @returns A Signal object.
 */
export function signal<T>(value: T): Signal<T>;
/**
 * Creates a new Signal with an initial value of undefined.
 * @returns A Signal object.
 */
export function signal<T>(): Signal<T | undefined>;
export function signal<T>(value?: T): Signal<T> | Signal<T | undefined> {
  const subscribers = new Set<Subscriber>();

  const sig = {
    get value() {
      if (currentSubscriber) {
        subscribers.add(currentSubscriber);
      }
      return value;
    },

    set value(newValue: T | undefined) {
      if (!Object.is(value, newValue)) {
        value = newValue;
        // Use [...subscribers] to create a copy, preventing issues if the set is modified during iteration.
        [...subscribers].forEach((cb) => cb());
      }
    },
  };
  return sig;
}

/**
 * Runs an effect function and subscribes it to any signals read within it.
 * The effect runs immediately once.
 * @param fn The function to run.
 */
export const effect = (fn: () => void): void => {
  currentSubscriber = fn;
  try {
    fn();
  } finally {
    currentSubscriber = null;
  }
};

/**
 * Creates a derived signal whose value is computed from other signals.
 * The derived value is read-only.
 * @param fn A function that computes the derived value.
 * @returns A Signal containing the derived value.
 */
export const derived = <T>(fn: () => T): Signal<T> => {
  // Create a signal that will hold the derived value. It starts as undefined.
  const derivedSignal = signal<T>();

  // Use an effect to compute the value and update the signal.
  // This effect will re-run whenever its dependencies change.
  effect(() => {
    derivedSignal.value = fn();
  });

  // The effect runs immediately, so derivedSignal.value is of type T.
  // We can safely cast the return type.
  return derivedSignal as Signal<T>;
};
