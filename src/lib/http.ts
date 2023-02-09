/*
 * @Author: Shirtiny
 * @Date: 2021-06-25 16:46:12
 * @LastEditTime: 2022-01-11 11:42:28
 * @Description:
 */

const enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
}

type bodyData =
  | Blob
  | BufferSource
  | FormData
  | URLSearchParams
  | ReadableStream<Uint8Array>
  | object;

interface RequestConfig {
  method: HTTP_METHODS;
  headers?: HeadersInit;
  bodyData?: bodyData;
  signal?: AbortSignal;
  timeout?: number;
}

export const request = async (url: string, config: RequestConfig) => {
  const abortController = new AbortController();

  if (config.signal) {
    config.signal.addEventListener("abort", () => {
      abortController.abort();
    });
  }

  if (config.timeout) {
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, config.timeout);
    abortController.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
    });
  }

  const bodyData = config.bodyData;
  const body =
    bodyData &&
    (typeof bodyData === "object" ? JSON.stringify(bodyData) : bodyData);

  const requestInit: RequestInit = {
    credentials: "same-origin",
    method: config.method,
    headers: new Headers({ ...config.headers }),
    signal: abortController.signal,
  };
  if (body) requestInit.body = body;

  try {
    const res = await fetch(url, requestInit);
    if (res.ok || (res.status >= 200 && res.status < 300)) {
      // TODO: 这里处理各种content-type
      const contentType = res.headers.get("content-type") || "";
      if (/application\/json/i.test(contentType)) {
        const resData = await res.json();
        return resData;
      }
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  } catch (e: any) {
    if (e.name === "AbortError") {
      return;
    }
    throw e;
  }
};

interface HttpOption {
  headers?: HeadersInit;
}

interface Http {
  get(url: string, param?: URLSearchParams, option?: HttpOption): Promise<any>;
  post(url: string, param?: object, option?: HttpOption): Promise<any>;
}

export const get = async (
  url: string,
  param?: URLSearchParams,
  option?: HttpOption,
) => {
  const query: string = param ? param.toString() : "";
  const data = await request(url + query, {
    method: HTTP_METHODS.GET,
    headers: option?.headers,
  });
  return data;
};

export const post = async (
  url: string,
  param?: object,
  option?: HttpOption,
) => {
  const data = await request(url, {
    method: HTTP_METHODS.POST,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      ...option?.headers,
    },
    bodyData: param,
  });
  return data;
};

const http: Http = {
  get,
  post,
};

export default http;
