/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 12:07:58
 * @LastEditTime: 2021-10-12 15:49:03
 * @Description:
 */
// node --expose-gc  .\node.testWeakMap.js

global.gc();
process.memoryUsage(); // heapUsed: 4638992 ≈ 4.4M

const map = new WeakMap();
let v = new Array(5 * 1024 * 1024);
map.set({}, {v});

global.gc();
console.log(process.memoryUsage().heapUsed); // heapUsed: 46776176 ≈ 44.6M

// v = null;
global.gc();
console.log(process.memoryUsage().heapUsed); // heapUsed: 4800792 ≈ 4.6M
