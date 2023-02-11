import { isFn, isText } from "./lang";
import { IEvent, IEventMap, Events } from "./events";
import logger from "../utils/logger";

export type TaskStatus = "waiting" | "running" | "done" | "error";

export interface ITask {
  key: string;
  pKey: string;
  name?: string;
  description?: string;
  // 时间戳 （秒）
  expire?: number;
  status?: TaskStatus;
  payload?: any;
  // 在任务完成时不删除此任务
  keepOnDone?: boolean;
}

export type TaskIdxParam = ITask | string;

const createIdx = (taskKey?: string, pKey?: string): string => {
  // * 表示全部
  return `${taskKey}__${pKey}`;
};

const transformToIdx = (idx: TaskIdxParam): string => {
  if (isText(idx)) return idx;
  return createIdx(idx.key, idx.pKey);
};

const createIdxReg = (taskKey: string = ".*", pKey: string = ".*") => {
  return new RegExp(`^${createIdx(taskKey, pKey)}$`);
};

type ITaskConstructParams = ITask & {};

export class Task implements ITask {
  key: string;
  pKey: string;
  idx: string;
  name?: string | undefined;
  description?: string | undefined;
  expire?: number | undefined;
  keepOnDone?: boolean;
  status: TaskStatus;
  payload?: any;

  constructor(params: ITaskConstructParams) {
    const { key, pKey, status, expire, keepOnDone = false, ...rest } = params;
    this.key = key;
    this.pKey = pKey;
    this.idx = createIdx(key, pKey);
    this.expire = expire || 0;
    this.status = status || "waiting";
    this.keepOnDone = !!keepOnDone;
    Object.assign(this, rest);
  }

  wait() {
    this.status = "waiting";
  }

  run() {
    this.status = "running";
  }

  done() {
    this.status = "done";
  }

  error() {
    this.status = "error";
  }
}

export interface IPublisher {
  key: string;
  name?: string;
  description?: string;
}

export interface ITaskHubStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface ITaskHubParams {
  storageKey: string | (() => string);
  storageAdapter?: ITaskHubStorageAdapter;
  autoSave?: boolean;
  loadOnCreate?: boolean;
  removeTaskOnDone?: boolean;
}

interface ITaskHubEvent extends IEvent {
  task: Task;
}

interface ITaskHubTaskStatusChangeEvent extends ITaskHubEvent {
  status: string;
}

interface ITaskHubEventMap extends IEventMap {
  taskStatusChange: ITaskHubTaskStatusChangeEvent;
  removeTask: ITaskHubEvent;
  addTask: ITaskHubEvent;
}

export class TaskHub extends Events<ITaskHubEventMap> {
  private storageKey: string | (() => string);
  private storage: ITaskHubStorageAdapter;
  private autoSave: boolean;
  private removeTaskOnDone: boolean;
  private data: Record<string, Task> = {};

  constructor(params: ITaskHubParams) {
    super();
    const {
      storageKey,
      storageAdapter = null,
      autoSave = true,
      loadOnCreate = true,
      removeTaskOnDone = true,
    } = params;
    this.storageKey = storageKey;
    this.storage = storageAdapter || (window && window.localStorage);
    this.removeTaskOnDone = !!removeTaskOnDone;
    this.autoSave = !!autoSave;

    if (loadOnCreate) {
      this.load();
    }
  }

  createTask(taskParam: ITask) {
    const task = new Task({
      ...taskParam,
    });

    const hub = this;

    // 代理task的状态变更
    return new Proxy(task, {
      set(target: Task, name: string, newValue: any, _receiver: any) {
        (target as any)[name] = newValue;
        if (name === "status") {
          hub.handleTaskStatusChange(target, newValue);
        }
        return true;
      },
    });
  }

  getStorageKey() {
    return isFn(this.storageKey) ? this.storageKey() : this.storageKey;
  }

  load() {
    const key = this.getStorageKey();
    try {
      const data = JSON.parse(this.storage.getItem(key) || "{}");
      Object.keys(data).forEach((idx) => {
        this.data[idx] = this.createTask(data[idx]);
      });
    } catch (e) {
      logger.error(
        "class TaskHub",
        "load",
        `an error accrued when load taskHub storage data from the key ${key}`,
        e,
      );
    }
  }

  save() {
    const key = this.getStorageKey();
    try {
      this.storage.setItem(key, JSON.stringify(this.data));
    } catch (e) {
      logger.error(
        "class TaskHub",
        "save",
        `an error accrued when save taskHub storage data by the key ${key}`,
        e,
      );
    }
  }

  afterDataChange() {
    if (this.autoSave) {
      this.save();
    }
  }

  pickTask(taskIdxParam: TaskIdxParam): Task | null {
    const idx = transformToIdx(taskIdxParam);
    return this.data[idx];
  }

  checkIsExist(taskIdxParam: TaskIdxParam) {
    return !!this.pickTask(taskIdxParam);
  }

  addTask(taskParam: ITask) {
    const isExist = this.checkIsExist(taskParam);
    if (isExist) {
      this.updateTask(taskParam, taskParam);
    } else {
      const task = this.createTask(taskParam);
      this.data[task.idx] = task;
      this.dispatch("addTask", { task });
    }
    this.afterDataChange();
  }

  updateTask(taskIdxParam: TaskIdxParam, taskParam: ITask) {
    const task = this.pickTask(taskIdxParam);
    if (!task) {
      return;
    }
    const oldPayload = task.payload;
    Object.assign(task, taskParam);
    // 在新payload未null时置空payload  否则合并 payload
    task.payload =
      task.payload === null
        ? null
        : Object.assign({}, oldPayload, taskParam.payload || {});
    this.afterDataChange();
  }

  removeTask(taskIdxParam: TaskIdxParam) {
    const idx = transformToIdx(taskIdxParam);
    const task = this.data[idx];
    delete this.data[idx];
    this.dispatch("removeTask", { task });
    this.afterDataChange();
  }

  listTasks() {
    return Object.values(this.data);
  }

  searchTasks({ key, pKey }: { key?: string; pKey?: string }): Task[] {
    const idxReg = createIdxReg(key, pKey);
    const tasks = Object.values(this.data).filter((t) => {
      return idxReg.test(t.idx);
    });
    return tasks;
  }

  handleTaskStatusChange = (task: Task, status: TaskStatus) => {
    this.dispatch("taskStatusChange", { status, task });
    // 任务完成时从列表中删除
    if (status === "done" && this.removeTaskOnDone && !task.keepOnDone) {
      this.removeTask(task.idx);
    }
    // 保存任务状态数据
    this.afterDataChange();
  };
}
