import util from "./lib/util";

// f(x) = 2x + 1
const func = (x: number) => {
  util.sleepSync(200);
  return x;
};

const run = util.memo(func);

//run(1); //?.
// run(1); //?.

// run(1, 2, 3); //?.$
// run(1, 2, 3); //?.$

run({a: 1});//?.$
run({a: 1});//?.$

run.cache.get({a: 1})//?
