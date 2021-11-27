/*
 * @Author: Shirtiny
 * @Date: 2021-06-26 20:47:19
 * @LastEditTime: 2021-11-27 10:53:44
 * @Description:
 */

const camelCase = require("camelcase");

const {
  HOST,
  PORT,
  NODE_ENV,
  PASSWORD,
  npm_package_version,
  npm_package_name,
} = process.env;

const env = {
  HOST,
  PORT,
  NODE_ENV,
  PASSWORD,
  npm_package_name,
  npm_package_version,
};

const globalName =
  camelCase(
    String(npm_package_name)
      .replace(/[\/-]/gi, "_")
      .replace(/[^a-z_]/gi, ""),
  ) || "globalName";

module.exports = {
  globalName,
  outputFileName: "main",
  devServer: {
    host: HOST || "localhost",
    port: PORT || 2021,
    proxy: {
      "^/api": {
        target: "http://192.168.0.123:1234",
        pathRewrite: { "^/api": "" },
      },
    },
  },
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  env,
};
