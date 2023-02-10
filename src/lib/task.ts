export interface ITask {
  key: string;
  publisherKey: string;
  name?: string;
  description?: string;
  store?: any;
}

export interface IPublisher {
  key: string;
  name?: string;
  description?: string;
  publish: (task: ITask) => void;
}

export class TaskClub {
  private tasks: ITask[] = [];
  private publishers: IPublisher[] = [];

  constructor() {
    this.tasks = [];
    this.publishers = [];
  }

  addTask(task: ITask) {
    this.tasks.push(task);
  }

  removeTask(task: ITask) {
    this.tasks = this.tasks.filter((t) => t.key !== task.key);
  }

  addPublisher(publisher: IPublisher) {
    this.publishers.push(publisher);
  }

  removePublisher(publisher: IPublisher) {
    this.publishers = this.publishers.filter((p) => p.key !== publisher.key);
  }

  publish(task: ITask) {
    const publisher = this.publishers.find((p) => p.key === task.publisherKey);
    if (publisher) {
      publisher.publish(task);
    }
  }
}

const publish = (task: ITask) => {};

const task = {};

export default task;
