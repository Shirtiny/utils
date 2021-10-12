/*
 * @Author: Shirtiny
 * @Date: 2021-09-30 12:07:58
 * @LastEditTime: 2021-10-12 16:02:23
 * @Description:
 */

// node --expose-gc  .\node.testWeakRef.js

const assertEquals = (a, b) => {
  console.log(process.memoryUsage().heapUsed);
  console.log(a === b);
};

let wr;
const map = new Map();
(function () {
  let o = new Array(5 * 1024 * 1024);
  // map.set("o", { o });
  wr = new WeakRef(o);
  map.set("o", { wr });
  // Don't deref here, we want to test that the creation is enough to keep the
  // WeakRef alive until the end of the turn.
})();

gc();

// Since the WeakRef was created during this turn, it is not cleared by GC.
(function () {
  assertEquals(undefined, wr.deref());
})();

// Next task.
setTimeout(() => {
  gc();
  assertEquals(undefined, wr.deref());
}, 0);
