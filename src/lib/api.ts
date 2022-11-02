interface IAsyncfunc {
  (...args: any[]): Promise<any>;
}

interface IResponseProcessor {
  (res: any): any;
}

type WrappedApiFuncResult = [any, Error | null];

interface IWrappedApiFunc {
  (params: {
    args: any[];
    defaultResData?: any;
    mockData?: any;
    mockDelay?: number;
    mockEnableKey?: string;
    resultProcessor?: (params: {
      res: any;
      functionName: string;
    }) => WrappedApiFuncResult;
  }): Promise<WrappedApiFuncResult>;
}

const wrapApiFuncs = (
  api: { [index: string]: IAsyncfunc },
  options: { responseProcessor: IResponseProcessor },
) => {
  const { responseProcessor } = options;

  const catchWrapper = (
    funcName: string,
    asyncFunc: IAsyncfunc,
  ): IWrappedApiFunc => {
    // wrap后调用时的参数
    return async ({
      args,
      mockData,
      mockDelay = 300,
      mockEnableKey = "sh_utils_api_use_mock_data",
      defaultResData = null,
      resultProcessor,
    }) => {
      const result: WrappedApiFuncResult = [defaultResData, null];

      try {
        const useMockData = !!mockData && !!localStorage.getItem(mockEnableKey);
        if (useMockData) {
          result[0] = mockData;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(result);
            }, mockDelay);
          });
        }

        const res = await asyncFunc(...args);
        if (resultProcessor) {
          return resultProcessor(res);
        }
        const data = responseProcessor({ res, functionName: funcName });
        result[0] = data;
        return result;
      } catch (e) {
        console.error(e);
        result[1] = e as Error;
        return result;
      }
    };
  };

  const wrappedApi: { [index: string]: IWrappedApiFunc } = {};
  for (const key in api) {
    if (Object.hasOwnProperty.call(api, key)) {
      wrappedApi[key] = catchWrapper(key, api[key]);
    }
  }
  return wrappedApi;
};

const api = { wrapApiFuncs };

export default api;
