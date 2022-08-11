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
