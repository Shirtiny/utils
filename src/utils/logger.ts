/*
 * @Author: Shirtiny
 * @Date: 2021-11-14 22:23:08
 * @LastEditTime: 2021-11-14 22:36:23
 * @Description:
 */

const warn = (lib:string, func:string, message:string) => {
  console.warn(
    `@shirtiny/utils ${lib}.${func}: ${message}`,
  );
  console.warn(new Error().stack);
};

const logger = {
  warn,
};

export default logger;
