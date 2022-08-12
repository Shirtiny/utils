/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:22:29
 * @LastEditTime: 2021-12-14 13:11:11
 * @Description:
 */
import {
  timer,
  from,
  fromEvent,
  defer,
  Subscription,
  Observable,
  Observer,
} from "rxjs";
import {
  switchMap,
  takeWhile,
  tap,
  takeUntil,
  retryWhen,
  delayWhen,
} from "rxjs/operators";
import { Events } from "./events";
import dev from "./dev";
import logger from "../utils/logger";

const LibName = "reactiveX";

export interface ITask {
  readonly name: string;
  start(params?: any): void;
  stop(params?: any): void;
}

const TaskMap = new Map<string, ITask>([
  [
    "ExampleTaskName",
    { name: "ExampleTaskName", start: () => {}, stop: () => {} },
  ],
]);

dev.set("taskMap", TaskMap);

interface IEventMap {
  started: undefined;
  stopped: undefined;
}

class ObservableTask extends Events<IEventMap> implements ITask {
  public readonly name: string;
  private _source: Observable<any>;
  private _subscription?: Subscription;

  constructor(name: string, source: Observable<any>) {
    super();
    this.name = name;
    this._source = source;
    const oldTask = TaskMap.get(name);
    if (oldTask) {
      oldTask.stop();
      TaskMap.delete(name);
      logger.warn(
        LibName,
        "Task constructor",
        `repeat task name: ${name} , has been overwrite`,
      );
    }
    TaskMap.set(name, this);
  }

  start(observer?: Partial<Observer<any>>): void {
    this._subscription = this._source.subscribe(observer);
    this.dispatch("started");
  }

  stop(): void {
    this._subscription?.unsubscribe();
    this.dispatch("stopped");
  }
}

// 时间任务
interface ITimerTaskOption {
  name: string;
  sec: number;
  delay?: number;
  request(index: number): Promise<any>;
  stopWhile?(requestResult: any): boolean | undefined;
}
/**
 * @description:强调定时 每次到时间就会执行
 * @param {ITimerTaskOption} option
 * @return {*}
 */
 export const createTimerTask = (option: ITimerTaskOption): ObservableTask => {
  const {
    name = "",
    sec = 5,
    delay = 0,
    request = async (_index: any) => {},
    stopWhile = (_res: any): any => false,
  } = option;

  const source = timer(delay * 1000, sec * 1000).pipe(
    switchMap((index) => from(request(index))),
    takeWhile((res) => !stopWhile(res)),
  );

  return new ObservableTask(name, source);
};

// 重试任务
interface IRetryTaskOption {
  name: string;
  request(): Promise<any>;
  delay?: number;
  maxRetryCount?: number;
  stopWhile?(curCount: number, e?: Error): boolean;
}

/**
 * @description: 出错时重试
 * @param {IRetryTaskOption} option
 * @return {*}
 */
 export const createRetryTask = (option: IRetryTaskOption): ITask => {
  const {
    name = "",
    delay = 0,
    request = async () => {},
    maxRetryCount = 0,
    stopWhile = () => false,
  } = option;
  let curCount = 0;

  const run = async () => {
    curCount++;
    await request();
  };

  const source = defer(run).pipe(
    retryWhen((errors) => {
      return errors.pipe(
        // 当 当前重试次数 小于 最大次数时 一直取值重试
        takeWhile((e) => stopWhile(curCount, e) || curCount < maxRetryCount),
        delayWhen(() => timer(delay * 1000)),
      );
    }),
  );
  const task = new ObservableTask(name, source);
  task.addEventListener("stopped", () => {
    curCount = 0;
  });

  return task;
};

// 鼠标悬停
interface IMouseHoveringOption {
  target: HTMLElement | null;
  wait: number;
  onDisplay?(target: HTMLElement): void;
  onHidden?(target: HTMLElement): void;
}

export const mouseHovering = (options: IMouseHoveringOption): void => {
  const { target, wait, onDisplay, onHidden } = options;
  if (!target) return;

  const display = () => {
    onDisplay && onDisplay(target);
  };

  const hidden = () => {
    onHidden && onHidden(target);
  };

  const leaveSource = fromEvent(target, "mouseleave").pipe(
    tap(() => {
      hidden();
    }),
  );

  const moveSource = fromEvent(target, "mousemove").pipe(
    tap(() => {
      display();
    }),
    switchMap(() =>
      timer(wait).pipe(
        tap(() => {
          wait && hidden();
        }),
        takeUntil(leaveSource),
      ),
    ),
  );

  leaveSource.subscribe();
  moveSource.subscribe();
};

const reactiveX = {
  createTimerTask,
  createRetryTask,
  mouseHovering,
};

export default reactiveX;
