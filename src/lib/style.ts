/*
 * @Author: Shirtiny
 * @Date: 2021-06-27 10:34:07
 * @LastEditTime: 2021-12-14 15:11:34
 * @Description:
 */

import lang from "./lang";

type Text = string | number;

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
export const isUnitlessNumber = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix: string, key: string): string {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
const prefixes = ["Webkit", "ms", "Moz", "O"];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function (prop) {
  prefixes.forEach(function (prefix) {
    (isUnitlessNumber as any)[prefixKey(prefix, prop)] = (
      isUnitlessNumber as any
    )[prop];
  });
});

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
  const usedPattern = isUseDefaultPattern ? defaultPattern : pattern || "";

  const keys = Object.keys(object);
  const clsParams = keys.map((k) => {
    const v = (object as any)[k];

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

export const parseStyleValue = (
  styleName: string,
  styleValue: any,
  isCustomProperty: boolean,
) => {
  const isEmpty =
    styleValue == null || typeof styleValue === "boolean" || styleValue === "";
  if (isEmpty) {
    return "";
  }

  if (
    !isCustomProperty &&
    typeof styleValue === "number" &&
    styleValue !== 0 &&
    !(
      isUnitlessNumber.hasOwnProperty(styleName) &&
      (isUnitlessNumber as any)[styleName]
    )
  ) {
    return styleValue + "px"; // Presumes implicit 'px' suffix for unitless numbers
  }
  return ("" + styleValue).trim();
};

export const toCSSStyle = (
  styles?: Object,
  options?: {
    onCustomProperty: (styleName: string, styleValue: string) => void;
  },
): Partial<CSSStyleDeclaration> => {
  const { onCustomProperty } = options || {};
  const CSSStyle = {};
  if (!styles) return CSSStyle;
  for (let styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }

    const isCustomProperty = styleName.indexOf("--") === 0;

    const styleValue = parseStyleValue(
      styleName,
      (styles as any)[styleName],
      isCustomProperty,
    );

    if (styleName === "float") {
      styleName = "cssFloat";
    }

    if (isCustomProperty) {
      onCustomProperty && onCustomProperty(styleName, styleValue);
    } else {
      (CSSStyle as any)[styleName] = styleValue;
    }
  }
  return CSSStyle;
};

const style = {
  cls,
  clsPainPattern,
  css,
  line,
  toCSSStyle,
};

export default style;
