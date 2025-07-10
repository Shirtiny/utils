type Effect = {
  execute: () => void;
  dependencies: Set<Set<Effect>>;
};

const context: Effect[] = [];

function subscribe(running: Effect, subscriptions: Set<Effect>) {
  subscriptions.add(running);
  running.dependencies.add(subscriptions);
}

/**
 * A reactive container for a value.
 */
export interface Signal<T> {
  value: T;
}

// Overload signatures for the signal function
export function signal<T>(value: T): Signal<T>;
export function signal<T>(value?: T): Signal<T | undefined>;

export function signal<T>(value?: T): Signal<T> | Signal<T | undefined> {
  const subscriptions = new Set<Effect>();

  const sig = {
    get value(): T | undefined {
      const running = context[context.length - 1];
      if (running) subscribe(running, subscriptions);
      return value;
    },

    set value(newValue: T | undefined) {
      if (!Object.is(value, newValue)) {
        value = newValue;
        // Use [...subscribers] to create a copy, preventing issues if the set is modified during iteration.
        for (const sub of [...subscriptions]) {
          sub.execute();
        }
      }
    },
  };
  return sig;
}

function cleanup(running: Effect) {
  for (const dep of running.dependencies) {
    dep.delete(running);
  }
  running.dependencies.clear();
}

export function effect(fn: () => void): () => void {
  const execute = () => {
    cleanup(running);
    context.push(running);
    try {
      fn();
    } finally {
      context.pop();
    }
  };

  const running: Effect = {
    execute,
    dependencies: new Set(),
  };

  execute();

  // Return a cleanup function that will remove this effect from its dependencies.
  return () => cleanup(running);
}

/**
 * Creates a derived signal whose value is computed from other signals.
 * The derived value is read-only.
 * @param fn A function that computes the derived value.
 * @returns A Signal containing the derived value, with a dispose method to clean up the effect.
 */
export const derived = <T>(fn: () => T): Signal<T> & { dispose: () => void } => {
  // Create a signal that will hold the derived value. It starts as undefined.
  const derivedSignal = signal<T>();

  // Use an effect to compute the value and update the signal.
  // This effect will re-run whenever its dependencies change.
  const cleanup = effect(() => {
    derivedSignal.value = fn();
  });

  // The effect runs immediately, so derivedSignal.value is of type T.
  // We can safely cast the return type.
  const result = derivedSignal as Signal<T> & { dispose: () => void };
  result.dispose = cleanup;

  return result;
};
