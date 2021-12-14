/*
 * @Author: Shirtiny
 * @Date: 2021-11-14 22:23:08
 * @LastEditTime: 2021-12-14 13:37:59
 * @Description:
 */

const warn = (lib: string, func: string, message: string, ...data: any[]) => {
  console.warn(`@shirtiny/utils ${lib}.${func}: ${message}`, ...data);
  console.warn(new Error().stack);
};

const logger = {
  warn,
};

export default logger;
