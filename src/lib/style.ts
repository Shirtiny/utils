/*
 * @Author: Shirtiny
 * @Date: 2021-06-27 10:34:07
 * @LastEditTime: 2021-12-14 15:11:34
 * @Description:
 */

import lang from "./lang";

type Text = string | number;

// 输入数组、对象、字符串 输出为 class字符串
export const cls = (...args: any[]): string => {
  const classes: Text[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    const argType = typeof arg;

    if (lang.isText(arg)) {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cls(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === "object") {
      if (arg.toString === {}.toString) {
        for (const key in arg) {
          if ({}.hasOwnProperty.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }

  return classes.join(" ");
};

/**
 * @description create classname with a pain template, default pattern: {k}-{v}
 * @param {object} object k-v 对象 -eg: { size: "small", type: "link", rotate: true }
 * @param {string} pattern  -eg: template-{k}-{v}
 * @param {Function} getKeyOnValueIsBool 当v为布尔值时 自定义输出key的值
 * @returns {string} output classNames
 */
export const clsPainPattern = (
  object: object,
  pattern?: string,
  getKeyOnValueIsBool?: (v: boolean, outputKey: string) => string,
): string => {
  const kP = "{k}";
  const vP = "{v}";
  const defaultPattern = `${kP}-${vP}`;
  const isUseDefaultPattern = !pattern;
  const usedPattern = isUseDefaultPattern ? defaultPattern : pattern;

  const keys = Object.keys(object);
  const clsParams = keys.map((k) => {
    const v = object[k];

    let key = usedPattern.split(kP).join(k).split(vP).join(v);
    if (lang.isBoolean(v)) {
      isUseDefaultPattern && (key = k);
      getKeyOnValueIsBool && (key = getKeyOnValueIsBool(v, key));
    }

    return {
      [key]: !!v,
    };
  });
  return cls(...clsParams);
};

export const line = (str?: string) => {
  return str ? str.replace(/\s*(;|\{|\})+\s*[\n\r]*/g, "$1") : "";
};

export const css = (literals: TemplateStringsArray, ...values: Text[]) => {
  // 模板字符串无变量时 values为空数组 literals数组只有一个值 是模版字符串本身
  if (!values.length) {
    return line(literals[0]);
  }
  let cssStr: string = "";

  values.forEach((value, index) => {
    cssStr += literals[index] + value;
  });
  // literals总比values多一个 遍历values完毕后 还剩一个literal没有加上
  cssStr += literals[literals.length - 1];
  return line(cssStr);
};

const style = {
  cls,
  clsPainPattern,
  css,
  line,
};

export default style;
