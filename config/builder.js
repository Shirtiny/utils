/*
 * @Author: Shirtiny
 * @Date: 2021-06-26 17:41:22
 * @LastEditTime: 2021-11-21 18:47:06
 * @Description:
 */
const esbuild = require("esbuild");
const childProcess = require("child_process");
const path = require("path");
const { config, isDev } = require("./var");
const logger = require("./logger");
const { readdirSync } = require("fs");

const srcDirPath = "../src";
const distDirPath = "../dist";
const libDirRelativePath = "/lib";
const depDirRelativePath = "/utils";

const typesDirPath = path.resolve(__dirname, `${distDirPath}/types`);
const fileName = config.outputFileName || "main";

const tscCommand = `tsc --declaration --declarationDir ${typesDirPath} --emitDeclarationOnly`;

const createFilePath = (dirPath, fileName) => {
  return path.resolve(__dirname, `${dirPath}/${fileName}`);
};

const getLibNames = () => {
  return readdirSync(
    path.resolve(__dirname, srcDirPath + libDirRelativePath),
  ).filter((f) => /\.(js|ts)$/.test(f));
  // .map((f) => f.slice(0, f.lastIndexOf("."))); /* ? */
};

const getDepNames = () => {
  return readdirSync(
    path.resolve(__dirname, srcDirPath + depDirRelativePath),
  ).filter((f) => /\.(js|ts)$/.test(f));
}

const buildList = [
  {
    entryPoints: [createFilePath(srcDirPath, "main.ts")],
    platform: "neutral",
    outfile: createFilePath(distDirPath, fileName + ".es.js"),
    bundle: false,
  },
  {
    entryPoints/* ? */: getLibNames().map((f) => createFilePath(srcDirPath+ libDirRelativePath, f)),
    platform: "neutral",
    outdir/* ? */: path.resolve(__dirname, distDirPath + libDirRelativePath),
    bundle: false,
  },
  {
    entryPoints/* ? */: getDepNames().map((f) => createFilePath(srcDirPath+ depDirRelativePath, f)),
    platform: "neutral",
    outdir/* ? */: path.resolve(__dirname, distDirPath + depDirRelativePath),
    bundle: false,
  },
];

const build = async ({
  entryPoints = [],
  platform,
  outfile,
  outdir,
  plugins = [],
  bundle = true,
}) => {
  try {
    await esbuild.build({
      entryPoints,
      platform,
      globalName: config.globalName,
      bundle,
      minify: !isDev,
      sourcemap: isDev ? "both" : false,
      define: {
        "process.env": JSON.stringify(process.env),
      },
      outfile,
      outdir,
      plugins,
      jsxFactory: config.jsxFactory,
      jsxFragment: config.jsxFragment,
    });
    childProcess.execSync(tscCommand);
    logger.chan("Building", [entryPoints.join("; ")], outfile || outdir);
  } catch (e) {
    return console.error(e.message);
  }
};

const buildAll = async () => {
  logger.log("o(*^▽^*)┛ bundle, please wait...\n");
  const promises = buildList.map((item) => build(item));
  try {
    await Promise.all(promises);
    logger.log("\n♪(^∇^*) done~☆!");
  } catch (e) {
    console.log(e.message);
  }
};

buildAll();
