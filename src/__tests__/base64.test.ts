/**
 * @jest-environment jsdom
 */

/*
 * @Author: Shirtiny
 * @Date: 2022-01-14 16:22:41
 * @LastEditTime: 2022-01-17 12:08:51
 * @Description:
 */
import base64 from "../lib/base64";

if (typeof TextEncoder === "undefined") {
  const u = require("util");
  global.TextEncoder = u.TextEncoder;
  global.TextDecoder = u.TextDecoder;
}

describe("base64", () => {
  // const view = new DataView(buffer, 0);
  // view.setInt8(0, 65);
  // view.setInt8(1, 66);
  // view.setInt8(2, 67);
  const ABC = "ABC";
  const ABC_BASE64 = "QUJD";
  const abc = new Uint8Array([65, 66, 67]);

  const HA_HA = "哈哈";
  const HA_HA_BASE64 = "5ZOI5ZOI";
  const haHa = new Uint8Array([229, 147, 136, 229, 147, 136]);

  const SUFFIX = "setInt8";
  const SUFFIX_BASE64 = "c2V0SW50OA==";
  const NO_SUFFIX_BASE64 = "c2V0SW50OA";

  const SH_URL = "http://shirtiny.cn/1?a=23&b=34";
  const SH_URL_BASE64 = "aHR0cDovL3NoaXJ0aW55LmNuLzE/YT0yMyZiPTM0";
  const SH_URL_BASE64_URL_SAFE = "aHR0cDovL3NoaXJ0aW55LmNuLzE_YT0yMyZiPTM0";
  const shUrl = new Uint8Array([
    104, 116, 116, 112, 58, 47, 47, 115, 104, 105, 114, 116, 105, 110, 121, 46,
    99, 110, 47, 49, 63, 97, 61, 50, 51, 38, 98, 61, 51, 52,
  ]);

  const LONG_URL =
    "https://cn.bing.com/search???????????????????q=base64+url_safe+%e5%9c%a8%e7%ba%bf&qs=n&sp=-1&pq=base64+url_safe+&sc=0-16&sk=&cvid=B26F25E3D80A4AC2B58643AF9F5F6040&first=16&FORM=PERE1";
  const LONG_URL_BASE64 =
    "aHR0cHM6Ly9jbi5iaW5nLmNvbS9zZWFyY2g/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/cT1iYXNlNjQrdXJsX3NhZmUrJWU1JTljJWE4JWU3JWJhJWJmJnFzPW4mc3A9LTEmcHE9YmFzZTY0K3VybF9zYWZlKyZzYz0wLTE2JnNrPSZjdmlkPUIyNkYyNUUzRDgwQTRBQzJCNTg2NDNBRjlGNUY2MDQwJmZpcnN0PTE2JkZPUk09UEVSRTE=";
  const LONG_URL_BASE64_URL_SAFE =
    "aHR0cHM6Ly9jbi5iaW5nLmNvbS9zZWFyY2g_Pz8_Pz8_Pz8_Pz8_Pz8_Pz8_cT1iYXNlNjQrdXJsX3NhZmUrJWU1JTljJWE4JWU3JWJhJWJmJnFzPW4mc3A9LTEmcHE9YmFzZTY0K3VybF9zYWZlKyZzYz0wLTE2JnNrPSZjdmlkPUIyNkYyNUUzRDgwQTRBQzJCNTg2NDNBRjlGNUY2MDQwJmZpcnN0PTE2JkZPUk09UEVSRTE";

  it("ab2str", () => {
    expect(base64.ab2str(abc)).toBe(ABC);
    expect(base64.ab2str(haHa)).toBe(HA_HA);
    expect(base64.ab2str(shUrl)).toBe(SH_URL);
  });

  it("str2ab", () => {
    expect(base64.str2ab(ABC)).toEqual(abc);
    expect(base64.str2ab(HA_HA)).toEqual(haHa);
    expect(base64.str2ab(SH_URL)).toEqual(shUrl);
  });

  it("ab2Base64", () => {
    expect(base64.ab2Base64(abc)).toBe(ABC_BASE64);
    expect(base64.ab2Base64(haHa)).toBe(HA_HA_BASE64);
    expect(base64.ab2Base64(shUrl)).toBe(SH_URL_BASE64);
  });

  it("base642ab", () => {
    expect(base64.base642ab(ABC_BASE64)).toEqual(abc);
    expect(base64.base642ab(HA_HA_BASE64)).toEqual(haHa);
    expect(base64.base642ab(SH_URL_BASE64)).toEqual(shUrl);
  });

  it("toBase64", () => {
    expect(base64.toBase64(ABC)).toBe(ABC_BASE64);
    expect(base64.toBase64(HA_HA)).toBe(HA_HA_BASE64);
    expect(base64.toBase64(SH_URL)).toBe(SH_URL_BASE64);
    expect(base64.toBase64(SUFFIX)).toBe(SUFFIX_BASE64);
    expect(base64.toBase64(LONG_URL)).toBe(LONG_URL_BASE64);
  });

  it("fromBase64", () => {
    expect(base64.fromBase64(ABC_BASE64)).toBe(ABC);
    expect(base64.fromBase64(HA_HA_BASE64)).toBe(HA_HA);
    expect(base64.fromBase64(SH_URL_BASE64)).toBe(SH_URL);
    expect(base64.fromBase64(LONG_URL_BASE64)).toBe(LONG_URL);
    expect(base64.fromBase64(SUFFIX_BASE64)).toBe(SUFFIX);
    expect(base64.fromBase64(NO_SUFFIX_BASE64)).toBe(SUFFIX);
  });

  it("toUrlSafe", () => {
    expect(base64.toUrlSafe(SH_URL_BASE64)).toBe(SH_URL_BASE64_URL_SAFE);
    expect(base64.toUrlSafe(LONG_URL_BASE64)).toBe(LONG_URL_BASE64_URL_SAFE);
  });

  it("fromUrlSafe", () => {
    expect(base64.fromUrlSafe(SH_URL_BASE64_URL_SAFE)).toBe(SH_URL_BASE64);
    expect(base64.fromUrlSafe(LONG_URL_BASE64_URL_SAFE)).toBe(LONG_URL_BASE64);
  });

  it("toBase64Url", () => {
    expect(base64.toBase64Url(SH_URL)).toBe(SH_URL_BASE64_URL_SAFE);
    expect(base64.toBase64Url(LONG_URL)).toBe(LONG_URL_BASE64_URL_SAFE);
  });

  it("toBase64Url", () => {
    expect(base64.fromBase64url(SH_URL_BASE64_URL_SAFE)).toBe(SH_URL);
    expect(base64.fromBase64url(LONG_URL_BASE64_URL_SAFE)).toBe(LONG_URL);
  });

  it("padSuffix", () => {
    expect(base64.padSuffix("cGFkU3VmZml4")).toBe("cGFkU3VmZml4");
    expect(base64.padSuffix("Y0dGa0c")).toBe("Y0dGa0c=");
    expect(base64.padSuffix("c2V0SW50OA")).toBe("c2V0SW50OA==");
  });

  it("removeSuffix", () => {
    expect(base64.removeSuffix("cGFkU3VmZml4")).toBe("cGFkU3VmZml4");
    expect(base64.removeSuffix("Y0dGa0c=")).toBe("Y0dGa0c");
    expect(base64.removeSuffix("c2V0SW50OA==")).toBe("c2V0SW50OA");
  });
});
