/**
 * @jest-environment jsdom
 */

/*
 * @Author: Shirtiny
 * @Date: 2022-01-14 16:22:41
 * @LastEditTime: 2022-01-14 18:49:22
 * @Description:
 */
import base64 from "../lib/base64";

if (typeof TextEncoder === "undefined") {
  global.TextEncoder = require("util").TextEncoder;
}

describe("base64", () => {
  it("ab2str", () => {
    expect(base64.ab2str([65, 66, 67])).toBe("ABC");
  });

  it("str2ab", () => {
    const buffer = new ArrayBuffer(3);
    // const view = new DataView(buffer, 0);
    // view.setInt8(0, 65);
    // view.setInt8(1, 66);
    // view.setInt8(2, 67);
    const arr = new Uint8Array(buffer);
    arr[0] = 65;
    arr[1] = 66;
    arr[2] = 67;
    expect(base64.str2ab("ABC")).toEqual(arr);
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
