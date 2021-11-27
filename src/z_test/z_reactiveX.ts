/*
 * @Author: Shirtiny
 * @Date: 2021-11-21 22:47:40
 * @LastEditTime: 2021-11-21 22:49:50
 * @Description:
 */

import { reactiveX } from "../main";

const mouseHovering = () => {
  const div = document.createElement("div");
  div.classList.add("mouse-hover-container");
  const span = document.createElement("span");
  span.textContent = "标题";
  span.classList.add("mouse-hover-title");
  div.appendChild(span);

  document.body.appendChild(div);

  reactiveX.mouseHovering({
    target: div,
    wait: 1000,
    onDisplay: (el) => {
      el.classList.add("display-title");
    },
    onHidden: (el) => {
      el.classList.remove("display-title");
    },
  });
};

const createRetryTask = () => {
  const timer = reactiveX.createTimerTask({
    name: "timer",
    request: async (index) => {
      console.log(index + "s");
    },
    sec: 1,
  });

  timer.start();

  const retryTask = reactiveX.createRetryTask({
    name: "retry",
    request: () => {
      console.log("开始发送请求");
      return new Promise((_resolve, reject) => {
        setTimeout(() => {
          console.log("请求出错");
          reject(new Error("自定义错误"));
        }, 500);
      });
    },
    delay: 1,
    maxRetryCount: 3,
    stopWhile: (curCount, e) => {
      console.log(`重试次数：${curCount}， 最大重试次数：${3}`, "捕获错误", e);
      return false;
    },
  });

  retryTask.start();
};

const reactiveXTest = { mouseHovering, createRetryTask };

export default reactiveXTest;
