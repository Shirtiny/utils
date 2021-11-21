/*
 * @Author: Shirtiny
 * @Date: 2021-09-29 18:17:03
 * @LastEditTime: 2021-11-21 23:50:19
 * @Description:
 */
import "./index.scss";
import { Events, util } from "./main";

type ActionTypes = "say";

const lrn = new Events<ActionTypes>();

const mjh = new Events<ActionTypes>();

mjh.addEventListener("say", (e) => {
  console.log("mjh 说话", e);
});

const l = (e, index) => {
  console.log(`lrnQ 第${index}次说话：`, e);
  mjh.dispatch("say", `i can hear you, baby 第${index}次`);
};

for (let index = 1; index < 1000; index++) {
  const r = (e) => l(e, index);
  lrn.addEventListener("say", r);
  setTimeout(() => {
    lrn.removeEventListener("say", r);

  }, 5001);
}

util.sleep(5000).then(() => {
  console.log("start");
  lrn.dispatch("say", "hi");
});
