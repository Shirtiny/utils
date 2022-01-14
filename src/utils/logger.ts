/*
 * @Author: Shirtiny
 * @Date: 2021-11-14 22:23:08
 * @LastEditTime: 2022-01-14 18:04:09
 * @Description:
 */

const warn = (lib: string, func: string, message: string, ...data: any[]) => {
  console.warn(`@shirtiny/utils ${lib}.${func}: ${message}`, ...data);
  console.warn(new Error().stack);
};

const error = (lib: string, func: string, message: string, ...data: any[]) => {
  console.error(`@shirtiny/utils ${lib}.${func}: ${message}`, ...data);
  console.error(new Error().stack);
};

const logger = {
  warn,
  error,
};

export default logger;
