"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const main_1 = require("./main");
console.log("hello world", main_1.add(1, 0), "dsdd");
const task = main_1.reactive.createTimerTask({
    name: "test",
    delay: 1,
    sec: 3,
    request: (d) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        console.log("request");
    }),
    stopWhile: () => {
        return false;
    },
});
task.start();
setTimeout(() => {
    task.stop();
}, 20000);
//# sourceMappingURL=index.js.map