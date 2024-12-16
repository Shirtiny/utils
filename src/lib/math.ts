/*
 * @Author: Shirtiny
 * @Date: 2021-10-15 10:46:35
 * @LastEditTime: 2021-11-27 17:58:56
 * @Description:
 */

export const restrict = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const str2Num = (input: string) => {
  if (!input) return 0;

  // 只保留数字、小数点和空白字符
  const str = String(input).replace(/[^0-9.\s]/g, "");
  const value = parseFloat(str);
  return isNaN(value) ? NaN : value;
}

const math = {
  restrict,
  str2Num,
};

export default math;
