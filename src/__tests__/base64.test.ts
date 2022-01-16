/**
 * @jest-environment jsdom
 */

/*
 * @Author: Shirtiny
 * @Date: 2022-01-14 16:22:41
 * @LastEditTime: 2022-01-16 14:34:21
 * @Description:
 */
import base64 from "../lib/base64";

if (typeof TextEncoder === "undefined") {
  const u = require("util");
  global.TextEncoder = u.TextEncoder;
  global.TextDecoder = u.TextDecoder;
}

describe("base64", () => {
  it("ab2str", () => {
    expect(base64.ab2str([65, 66, 67])).toBe("ABC");
    expect(base64.ab2str([229, 147, 136, 229, 147, 136])).toBe("哈哈");
  });

  it("str2ab", () => {
    // const view = new DataView(buffer, 0);
    // view.setInt8(0, 65);
    // view.setInt8(1, 66);
    // view.setInt8(2, 67);
    const arr = new Uint8Array(new ArrayBuffer(3));
    arr[0] = 65;
    arr[1] = 66;
    arr[2] = 67;
    expect(base64.str2ab("ABC")).toEqual(arr);
    const arr2 = new Uint8Array(new ArrayBuffer(6));
    arr2[0] = 229;
    arr2[1] = 147;
    arr2[2] = 136;
    arr2[3] = 229;
    arr2[4] = 147;
    arr2[5] = 136;
    expect(base64.str2ab("哈哈")).toEqual(arr2);
  });

  it("padSuffix", () => {
    expect(base64.padSuffix("cGFkU3VmZml4")).toBe("cGFkU3VmZml4");
    expect(base64.padSuffix("Y0dGa0c")).toBe("Y0dGa0c=");
    expect(base64.padSuffix("c2V0SW50OA")).toBe("c2V0SW50OA==");
  });

  it("ab2Base64", () => {
    expect(base64.ab2Base64(base64.str2ab("ABC"))).toBe("QUJD");
    expect(base64.ab2Base64(base64.str2ab("中文"))).toBe("5Lit5paH");
    expect(
      base64.ab2Base64(base64.str2ab("http://shirtiny.cn/1?a=23&b=34")),
    ).toBe("aHR0cDovL3NoaXJ0aW55LmNuLzE/YT0yMyZiPTM0");
  });
});
