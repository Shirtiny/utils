/*
 * @Author: Shirtiny
 * @Date: 2021-10-15 10:46:35
 * @LastEditTime: 2021-10-15 10:51:51
 * @Description:
 */

const restrict = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const math = {
  restrict,
};

export default math;
