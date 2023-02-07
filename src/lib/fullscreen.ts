// https://github.com/any86/be-full/blob/master/main.ts

import logger from "../utils/logger";

type RFSMethodName =
  | "webkitRequestFullScreen"
  | "requestFullscreen"
  | "msRequestFullscreen"
  | "mozRequestFullScreen";
type EFSMethodName =
  | "webkitExitFullscreen"
  | "msExitFullscreen"
  | "mozCancelFullScreen"
  | "exitFullscreen";
type FSEPropName =
  | "webkitFullscreenElement"
  | "msFullscreenElement"
  | "mozFullScreenElement"
  | "fullscreenElement";
type ONFSCPropName =
  | "onfullscreenchange"
  | "onwebkitfullscreenchange"
  | "onmozfullscreenchange"
  | "MSFullscreenChange";

function prepareEnv() {
  /**
   * caniuse
   * https://caniuse.com/#search=Fullscreen
   * 参考 MDN, 并不确定是否有o前缀的, 暂时不加入
   * https://developer.mozilla.org/zh-CN/docs/Web/API/Element/requestFullscreen
   * 各个浏览器
   * https://www.wikimoe.com/?post=82
   */
  const DOC_EL = document.documentElement;

  let RFC_METHOD_NAME: RFSMethodName = "requestFullscreen";
  let EFS_METHOD_NAME: EFSMethodName = "exitFullscreen";
  let FSE_PROP_NAME: FSEPropName = "fullscreenElement";
  let ON_FSC_PROP_NAME: ONFSCPropName = "onfullscreenchange";

  if (`webkitRequestFullScreen` in DOC_EL) {
    RFC_METHOD_NAME = "webkitRequestFullScreen";
    EFS_METHOD_NAME = "webkitExitFullscreen";
    FSE_PROP_NAME = "webkitFullscreenElement";
    ON_FSC_PROP_NAME = "onwebkitfullscreenchange";
  } else if (`msRequestFullscreen` in DOC_EL) {
    RFC_METHOD_NAME = "msRequestFullscreen";
    EFS_METHOD_NAME = "msExitFullscreen";
    FSE_PROP_NAME = "msFullscreenElement";
    ON_FSC_PROP_NAME = "MSFullscreenChange";
  } else if (`mozRequestFullScreen` in DOC_EL) {
    RFC_METHOD_NAME = "mozRequestFullScreen";
    EFS_METHOD_NAME = "mozCancelFullScreen";
    FSE_PROP_NAME = "mozFullScreenElement";
    ON_FSC_PROP_NAME = "onmozfullscreenchange";
  } else if (!(`requestFullscreen` in DOC_EL)) {
    logger.warn("fullscreen", "selfExec", `当前浏览器不支持Fullscreen API !`);
  }

  return {
    DOC_EL,
    RFC_METHOD_NAME,
    EFS_METHOD_NAME,
    FSE_PROP_NAME,
    ON_FSC_PROP_NAME,
    document: document as any,
  };
}
/**
 * 启用全屏
 * @param  {HTMLElement} 元素
 * @param  {FullscreenOptions} 选项
 * @returns {Promise}
 */
function beFull(el?: HTMLElement, options?: FullscreenOptions): Promise<void> {
  const { DOC_EL, RFC_METHOD_NAME } = prepareEnv();
  const element = (el ? el : DOC_EL) as any;
  return element[RFC_METHOD_NAME](options);
}

/**
 * 退出全屏
 */
function exitFull(): Promise<void> {
  const { EFS_METHOD_NAME, document } = prepareEnv();
  return document[EFS_METHOD_NAME]();
}

/**
 * 元素是否全屏
 * @param {HTMLElement}
 */
function isFull(el?: HTMLElement | EventTarget): boolean {
  const { FSE_PROP_NAME, DOC_EL, document } = prepareEnv();
  const element = el ? el : DOC_EL;
  return element === document[FSE_PROP_NAME];
}

/**
 * 切换全屏/关闭
 * @param  {HTMLElement} 目标元素
 * @returns {Promise}
 */
export function toggle(
  el?: HTMLElement,
  options?: FullscreenOptions,
): Promise<void> {
  if (isFull(el)) {
    return exitFull();
  } else {
    return beFull(el, options);
  }
}

/**
 * 当全屏/退出时触发
 * @param  {HTMLElement} 元素
 * @param  {(isFull: boolean) => void} 返回"是否全屏"
 */
export function watch(el: HTMLElement, callback: (isFull: boolean) => void) {
  const cancel = () => {
    el.onfullscreenchange = null;
  };

  const handler = (event: Event) => {
    if (null !== event.target) {
      callback(isFull(event.target));
    }
  };

  const { ON_FSC_PROP_NAME } = prepareEnv();

  // 这里addEventListener不好使
  (el as any)[ON_FSC_PROP_NAME] = handler;

  return {
    cancel,
  };
}

const fullscreen = {
  toggle,
  watch,
};

export default fullscreen;
