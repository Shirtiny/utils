/*
 * @Author: Shirtiny
 * @Date: 2021-11-20 11:44:13
 * @LastEditTime: 2021-12-14 13:09:08
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
  readonly name: string;
  readonly target: any;
}

export interface IEventMap {}

export abstract class Events<M extends IEventMap> {
  private _notifier: INotifier<any, any>;
  constructor() {
    this._notifier = new Notifier();
  }

  protected abstract beforeAddEventListener<K extends keyof M>(
    name: K,
    callBack: (event?: M[K]) => any,
  ): void;

  addEventListener<K extends keyof M>(
    name: K,
    callBack: (event?: M[K]) => any,
  ) {
    this.beforeAddEventListener(name, callBack);
    this._notifier.subscribe(name, callBack);
  }

  protected abstract beforeRemoveEventListener<K extends keyof M>(
    name: K,
    callBack: (event?: M[K]) => any,
  ): void;

  removeEventListener<K extends keyof M>(
    name: K,
    callBack: (event?: M[K]) => any,
  ) {
    this.beforeRemoveEventListener(name, callBack);
    this._notifier.unSubscribe(name, callBack);
  }

  protected abstract beforeDispatch<K extends keyof M>(
    name: K,
    event?: M[K],
  ): void;

  protected dispatch<K extends keyof M>(name: K, event?: M[K]) {
    this.beforeDispatch(name, event);
    this._notifier.publish(name, event);
  }
}
