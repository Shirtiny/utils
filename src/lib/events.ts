/*
 * @Author: Shirtiny
 * @Date: 2021-11-20 11:44:13
 * @LastEditTime: 2021-11-21 23:48:56
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

type INotifierQueue<P> = INotifierExecutor<P>[];

export class Notifier<K, P = any> implements INotifier<K, P> {
  private readonly _map = new Map<K, INotifierQueue<P>>();

  private findExecutor(name: K, executor: INotifierExecutor<P>) {
    const que = this._map.get(name);
    const index = que ? que.findIndex((fn) => executor === fn) : -1;
    return {
      index,
      que,
    };
  }

  publish(name: K, param?: P): void {
    const que = this._map.get(name) || [];
    que.map((exec) =>
      (async () => {
        return exec && exec(param);
      })(),
    );
  }

  subscribe(
    name: K,
    executor: INotifierExecutor<P>,
  ): INotifierSubscription<K, P> {
    const { index, que = [] } = this.findExecutor(name, executor);
    const copy = que.slice();
    index >= 0 ? (copy[index] = executor) : copy.push(executor);
    this._map.set(name, copy);
    return {
      unSubscribe: () => {
        this.unSubscribe(name, executor);
      },
    };
  }

  unSubscribe(name: K, executor: INotifierExecutor<P>): void {
    const { index, que = [] } = this.findExecutor(name, executor);
    if (index < 0) return;
    const copy = que.slice();
    copy.splice(index, 1);
    this._map.set(name, copy);
  }
}

export class Events<K, P = any> {
  private _notifier: INotifier<K, P>;
  constructor() {
    this._notifier = new Notifier();
  }

  addEventListener(name: K, callBack: (param?: P) => any) {
    this._notifier.subscribe(name, callBack);
  }

  removeEventListener(name: K, callBack: (param?: P) => any) {
    this._notifier.unSubscribe(name, callBack);
  }

  dispatch(name: K, param?: P) {
    this._notifier.publish(name, param);
  }
}
