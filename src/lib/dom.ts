import { grow, RenderTarget, JSX } from "./jsx";

export function parseHtml(htmlString: string): DocumentFragment {
  return document.createRange().createContextualFragment(htmlString);
}

export function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  properties?: object,
  is?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag, { is });

  return Object.assign(element, properties);
}

export function createFragment() {
  return document.createDocumentFragment();
}

export function append<N extends Node>(
  parent?: N | null,
  ...children: any[]
): void {
  if (!parent) return;
  const frag = createFragment();
  frag.append(...(children.filter((n) => n) as N[]));
  parent.appendChild(frag);
}

export function empty<N extends Node>(parent?: N | null): void {
  if (!parent) return;
  if (parent instanceof Element) {
    parent.innerHTML = "";
    return;
  } else {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
}

export function replace<N extends Node>(
  oldNode: N | null | undefined,
  ...newNodes: any[]
): void {
  if (!newNodes.length || !oldNode?.parentNode) return;
  const nodes = newNodes.filter((n) => n);
  if (oldNode instanceof Element) {
    oldNode.replaceWith(...nodes);
  } else {
    const frag = createFragment();
    frag.append(...nodes);
    oldNode.parentNode.replaceChild(frag, oldNode);
  }
}

export function removeSelf<N extends Node>(el?: N | null): void {
  if (!el) return;
  if (el instanceof Element) {
    el.remove();
    return;
  } else {
    el.parentNode?.removeChild(el);
  }
}

// 不导出 外部没必要使用
function elementFactory(element: JSX.Element | null) {
  if (!element || !element.props) return element;
  // const { props } = element;
  // if (props.withCommonNamespace) {
  //   props.className = style.commonCls(props.className);
  //   delete props.withCommonNamespace;
  // }
  return element;
}

// 从jsx创建dom节点
export function createByJsx<T = RenderTarget>(
  element: JSX.Element | null,
): T | null {
  if (!element) return null;
  return <T>(<unknown>grow(element, elementFactory));
}

export function getElementTypeByTag<K extends keyof HTMLElementTagNameMap>(
  tag: K,
) {
  return Reflect.getPrototypeOf(document.createElement(tag))!
    .constructor as any;
}

const dom = {
  parseHtml,
  create,
  createFragment,
  createByJsx,
  append,
  empty,
  replace,
  removeSelf,
  getElementTypeByTag,
};

export default dom;
