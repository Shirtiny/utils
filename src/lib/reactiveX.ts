/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:22:29
 * @LastEditTime: 2021-11-02 14:47:03
 * @Description:
 */
import { timer, from, fromEvent } from "rxjs";
import { switchMap, takeWhile, tap, takeUntil } from "rxjs/operators";

import dev from "./dev";

export interface ITask {
  name: string;
  start(): void;
  stop(): void;
}

const TaskMap = new Map<string, ITask>([
  [
    "ExampleTaskName",
    { name: "ExampleTaskName", start: () => {}, stop: () => {} },
  ],
]);

dev.set("taskMap", TaskMap);

// 时间任务
interface ITaskOption {
  name: string;
  sec: number;
  delay?: number;
  request(index: number): Promise<any>;
  stopWhile(requestResult: any): boolean | undefined;
}

const createTimerTask = (option: ITaskOption): ITask => {
  const {
    name = "",
    sec = 5,
    delay = 0,
    request = async (_index: any) => {},
    stopWhile = (_res: any): any => {},
  } = option;

  const oldTask = TaskMap.get(name);
  if (oldTask) {
    oldTask.stop();
    TaskMap.delete(name);
  }
  const source = timer(delay * 1000, sec * 1000).pipe(
    switchMap((index) => from(request(index))),
    takeWhile((res) => !stopWhile(res)),
  );

  const newTask = {
    name,
    start() {
      const subscription = source.subscribe({
        next: () => {},
        error: (e) => console.error(e, "定时任务出错"),
        complete: () => {},
      });

      this.stop = () => {
        subscription.unsubscribe();
      };
    },
    stop() {},
  };
  TaskMap.set(name, newTask);
  return newTask;
};

// 鼠标悬停
interface IMouseHoveringOption {
  target: HTMLElement | null;
  wait: number;
  onDisplay?(target: HTMLElement): void;
  onHidden?(target: HTMLElement): void;
}

const mouseHovering = (options: IMouseHoveringOption): void => {
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
  mouseHovering,
};

export default reactiveX;
