/*
 * @Author: Shirtiny
 * @Date: 2021-10-15 10:46:35
 * @LastEditTime: 2021-11-27 17:58:56
 * @Description:
 */

export const restrict = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const math = {
  restrict,
};

export default math;
