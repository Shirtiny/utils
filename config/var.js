/*
 * @Author: Shirtiny
 * @Date: 2021-06-26 20:17:19
 * @LastEditTime: 2021-11-27 10:38:53
 * @Description:
 */

const config = require("../.sh");

console.log("ENV: ", config.env);

module.exports = {
  config,
  isDev: process.env.NODE_ENV === "development",
};
