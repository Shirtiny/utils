/*
 * @Author: Shirtiny
 * @Date: 2021-11-20 11:44:13
 * @LastEditTime: 2021-12-14 15:44:05
 * @Description:
 */

interface INotifierExecutor<P = any> {
  (param?: P): any;
}

interface INotifierSubscription<K, P> {
  unSubscribe(name: K, executor: INotifierExecutor<P>): void;
}

interface INotifier<K, P = any> {
  publish(name: K, params?: P): void;
  subscribe(
    name: K,
    executor: INotifierExecutor<P>,
  ): INotifierSubscription<K, P>;
  unSubscribe(name: K, executor: INotifierExecutor<P>): void;
}

type NotifierQueue<P> = INotifierExecutor<P>[];

export class Notifier<K, P = any> implements INotifier<K, P> {
  private _map = new Map<K, NotifierQueue<P>>();

  private findExecutor(name: K, executor: INotifierExecutor<P>) {
    const que = this._map.get(name);
    const index = que ? que.findIndex((fn) => Object.is(executor, fn)) : -1;
    return {
      index,
      que,
    };
  }

  publish(name: K, param?: P): void {
    const que = this._map.get(name) || [];
    const total = que.length;
    for (let index = 0; index < total; index++) {
      const exec = que[index];
      exec && exec(param);
    }
  }

  subscribe(
    name: K,
    executor: INotifierExecutor<P>,
  ): INotifierSubscription<K, P> {
    const { index, que = [] } = this.findExecutor(name, executor);
    index >= 0 ? (que[index] = executor) : que.push(executor);
    this._map.set(name, que);
    return {
      unSubscribe: () => {
        this.unSubscribe(name, executor);
      },
    };
  }

  unSubscribe(name: K, executor: INotifierExecutor<P>): void {
    const { index, que = [] } = this.findExecutor(name, executor);
    if (index < 0) return;
    que.splice(index, 1);
    this._map.set(name, que);
  }
}

export interface IEvent {
  readonly name?: string;
  readonly target?: any;
}

// event名称于 event listener参数类型的映射
export interface IEventMap {}

export class Events<M extends IEventMap> {
  protected _notifier: INotifier<any, any>;
  constructor() {
    this._notifier = new Notifier();
    Object.defineProperty(this, "_notifier", {
      enumerable: false,
    });
  }

  addEventListener<K extends keyof M>(
    name: K,
    callBack: (event?: M[K]) => any,
  ) {
    this._notifier.subscribe(name, callBack);
  }

  removeEventListener<K extends keyof M>(
    name: K,
    callBack: (event?: M[K]) => any,
  ) {
    this._notifier.unSubscribe(name, callBack);
  }

  protected dispatch<K extends keyof M>(name: K, event?: M[K]) {
    this._notifier.publish(name, { name, target: this, ...event });
  }
}

interface Observer {
  observe(target: Element, ...arg: any[]): any;
  disconnect(): void;
}

export class DomEventStore {
  private _store = new WeakMap<EventTarget, Map<string, EventListener[]>>();
  private _observersMap: Map<string, Observer> = new Map();

  // 添加dom监听
  add(el: EventTarget, eventType: string, listener: EventListener) {
    const map = this._store.get(el);
    if (!map) {
      this._store.set(el, new Map([[eventType, [listener]]]));
    } else {
      const arr = map.get(eventType) || [];
      arr.push(listener);
      map.set(eventType, arr);
    }
    el.addEventListener(eventType, listener);
  }

  // 移除监听器 eventType不传则移除全部 不指定listener则移除eventType下的全部监听器
  remove(el: EventTarget, eventType?: string, listener?: EventListener) {
    const map = this._store.get(el);
    if (!map) return;
    if (!eventType) {
      // 移除el全部监听器
      map.forEach((arr, key) => {
        arr.forEach((ls) => {
          el.removeEventListener(key, ls);
        });
      });
      map.clear();
      this._store.delete(el);
      return;
    }
    if (!listener) {
      // 只移除el eventType下的监听器
      const arr = map.get(eventType) || [];
      arr.forEach((ls) => {
        el.removeEventListener(eventType, ls);
      });
      map.delete(eventType);
      return;
    }
    const ls = (map.get(eventType) || []).find((l) => l === listener);
    if (!ls) {
      return;
    }
    el.removeEventListener(eventType, ls);
  }

  // 观察dom属性变化
  observeMutation(
    key: string,
    el: Node,
    callback: MutationCallback,
    attributes: string[] | MutationObserverInit,
  ): MutationObserver {
    const observer = new MutationObserver(callback);
    observer.observe(
      el,
      attributes instanceof Array
        ? {
            attributes: true,
            attributeFilter: attributes,
            attributeOldValue: true,
          }
        : attributes,
    );
    this.addObserver(key, observer);
    return observer;
  }

  // 观察dom尺寸变化
  observeResize(
    key: string,
    el: Element,
    callback: ResizeObserverCallback,
    box: ResizeObserverBoxOptions = "border-box",
  ): ResizeObserver {
    const observer = new ResizeObserver(callback);
    observer.observe(el, {
      box,
    });
    this.addObserver(key, observer);
    return observer;
  }

  protected addObserver(
    key: string,
    observer: ResizeObserver | MutationObserver,
  ) {
    const obExist = this._observersMap.get(key);
    if (obExist) obExist.disconnect();
    this._observersMap.set(key, observer);
  }

  removeObserver(key: string) {
    const obExist = this._observersMap.get(key);
    if (!obExist) return;
    obExist.disconnect();
    this._observersMap.delete(key);
  }

  clearObservers() {
    this._observersMap.forEach((observer) => {
      if (observer) {
        observer.disconnect();
      }
    });
    this._observersMap.clear();
  }

  getStore() {
    return this._store;
  }
}
