/*
 * @Author: Shirtiny
 * @Date: 2021-12-11 08:25:24
 * @LastEditTime: 2022-01-17 14:19:30
 * @Description: 项目写的jsx只是创建dom时执行一次 无其他逻辑
 */

import lang from "./lang";
import logger from "../utils/logger";

type RenderTarget = HTMLElement | SVGElement | Text | DocumentFragment | null;

function some(x: unknown) {
  return x != null && x !== true && x !== false;
}

function flat(arr: any[], target: any[] = []) {
  arr.forEach((v) => {
    lang.isArray(v)
      ? flat(v, target)
      : some(v) && target.push(lang.isText(v) ? text(v) : v);
  });
  return target;
}

function toArray(arr: any) {
  return !arr ? [] : lang.isArray(arr) ? arr : [arr];
}

// 只初始化无更新逻辑
function initProps(props: IJsxProps = {}, el: RenderTarget): void {
  if (!el) return;
  const keys = Object.keys(props);

  keys.forEach((k) => {
    if (k === "children" || k === "is") {
      return;
    }
    const v = props[k];
    if (lang.isNullOrUndefined(v)) return;

    if (k.startsWith("on")) {
      el.addEventListener(k.substring(2).toLowerCase(), v);
    } else {
      el instanceof Element
        ? el.setAttribute(k === "className" ? "class" : k, v)
        : ((<any>el)[k] = v);
    }
  });
}

function text(v?: any) {
  return { type: "", props: { nodeValue: String(v) + "" } } as JSX.Element;
}

type TagElementOption = {
  ns?: string;
  is?: string;
};

function tagElement(tag: string, option: TagElementOption) {
  const { ns, is } = option;
  return tag === ""
    ? document.createTextNode("")
    : ns
    ? (document.createElementNS(ns, tag, { is }) as Element & SVGElement)
    : document.createElement(tag, { is });
}

// 超简单易懂的实现 很多情况不考虑
export function grow(
  element: JSX.Element | null,
  elementFactory?: (element: JSX.Element | null) => JSX.Element | null,
  xmlns?: string,
): RenderTarget {
  const product = elementFactory ? elementFactory(element) : element;

  if (!product) return null;

  //FIXME:Fragment的实现并不是这样的 不过这样目的也达到了
  if (lang.isArray(product)) {
    const frag = document.createDocumentFragment();
    product.forEach((e) => {
      const node = grow(e);
      node && frag.appendChild(node);
    });
    return frag;
  }

  const { props, type } = product;

  // 注意 所有h创建element都会有props
  // 如果出现props为空的现象 请检查是不是混用了dom和jsx
  if (!props) {
    const isRenderTarget = product instanceof Node || product instanceof Text;
    if (!isRenderTarget) {
      logger.warn(
        "jsx",
        "grow",
        `未解析${product},因为它不是有效的jsx element，并且也不是RenderTarget类型`,
      );
      return null;
    }
    logger.warn(
      "jsx",
      "grow",
      `提示${product}并不是有效的jsx element 已经原样输出，不影响ui 但尽量少混用jsx和dom`,
    );
    return product as unknown as RenderTarget;
  }

  if (lang.isString(type)) {
    const el = tagElement(type, {
      ns: props.xmlns || xmlns,
      is: props.is,
    });
    initProps(props, el);
    const children = props.children || [];

    children.forEach((child: JSX.Element) => {
      const node = grow(child, elementFactory, props.xmlns);
      if (!node) return;
      el.appendChild(node);
    });
    return el;
  }

  if (lang.isFn(type)) {
    const miraElement: JSX.Element | null = type(props);
    return grow(miraElement, elementFactory);
  }

  return null;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K | string,
  elementProps: any,
  ...childElements: any[]
): JSX.Element {
  elementProps = elementProps || {};
  childElements = flat(toArray(elementProps.children || childElements));
  elementProps.children = childElements;
  return {
    type,
    props: elementProps,
  };
}

const Fragment = (props: IJsxProps) => props.children;

const jsx = {
  createElement,
  Fragment,
  createDom: grow,
};

export default jsx;
