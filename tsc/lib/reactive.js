"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rxjs_1 = require("rxjs");
const TaskMap = new Map([
    [
        "ExampleTaskName",
        { name: "ExampleTaskName", start: () => { }, stop: () => { } },
    ],
]);
const createTimerTask = (option) => {
    const { name = "", sec = 5, delay = 0, request = (_index) => tslib_1.__awaiter(void 0, void 0, void 0, function* () { }), stopWhile = (_res) => { }, } = option;
    const oldTask = TaskMap.get(name);
    if (oldTask) {
        oldTask.stop();
        TaskMap.delete(name);
    }
    const source = rxjs_1.timer(delay * 1000, sec * 1000).pipe(rxjs_1.switchMap((index) => rxjs_1.from(request(index))), rxjs_1.takeWhile((res) => !stopWhile(res)));
    const newTask = {
        name,
        start() {
            const subscription = source.subscribe({
                next: () => { },
                error: (e) => console.error(e, "定时任务出错"),
                complete: () => { },
            });
            this.stop = () => {
                subscription.unsubscribe();
            };
        },
        stop() { },
    };
    TaskMap.set(name, newTask);
    return newTask;
};
const reactive = {
    createTimerTask,
};
exports.default = reactive;
//# sourceMappingURL=reactive.js.map