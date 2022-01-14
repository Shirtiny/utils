/*
 * @Author: Shirtiny
 * @Date: 2021-06-25 11:43:20
 * @LastEditTime: 2022-01-11 11:37:59
 * @Description:
 */
declare module "*.json";

// fullscreen浏览器兼容扩展
interface HTMLElement {
  webkitRequestFullscreen(options?: FullscreenOptions): Promise<void>;
  webkitRequestFullScreen(options?: FullscreenOptions): Promise<void>;
  msRequestFullscreen(options?: FullscreenOptions): Promise<void>;
  mozRequestFullScreen(options?: FullscreenOptions): Promise<void>;

  onwebkitfullscreenchange: ((this: Element, ev: Event) => any) | null;
  onmozfullscreenchange: ((this: Element, ev: Event) => any) | null;
  MSFullscreenChange: ((this: Element, ev: Event) => any) | null;
}

interface HTMLMediaElement {
  captureStream(frameRate?: number): MediaStream;
}


interface Document {
  readonly webkitFullscreenElement: Element | null;
  readonly msFullscreenElement: Element | null;
  readonly mozFullScreenElement: Element | null;

  webkitExitFullscreen(): Promise<void>;
  msExitFullscreen(): Promise<void>;
  mozCancelFullScreen(): Promise<void>;
}

interface IJsxProps extends Record<string, any> {
  children?: Array<any>;
}

// 暂时不写那么复杂
// 注意创建的元素不只有htmlElement 这里只写通用jsx属性
// 想要定义某个elemName的属性 在IntrinsicElements新增行 格式为元素名称和对应接口
interface ICommonJsxAttributes extends Record<string, any> {
  className?: string;
  style?:string;
}

// 函数式
interface FC<P extends IJsxProps = any> {
  (props: P): JSX.Element | null;
  tag?: number;
  type?: string;
}

// jsx类型定义
declare namespace JSX {
  interface Element<P extends IJsxProps = any> {
    type: string | FC<P>;
    props: P;
    // key: string; 因为只用来创建 所以不管key
  }
  interface IntrinsicElements {
    [elemName: string]: ICommonJsxAttributes;
  }
}
