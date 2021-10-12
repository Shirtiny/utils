/*
 * @Author: Shirtiny
 * @Date: 2021-06-26 20:17:19
 * @LastEditTime: 2021-10-12 17:19:28
 * @Description:
 */

const config = require("../.sh");

console.log("ENV: ", process.env);
console.log("NODE_ENV: ", process.env.NODE_ENV);

module.exports = {
  config,
  isDev: process.env.NODE_ENV === "development",
};
