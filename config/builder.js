/*
 * @Author: Shirtiny
 * @Date: 2021-06-26 17:41:22
 * @LastEditTime: 2021-12-21 18:24:22
 * @Description:
 */
const esbuild = require("esbuild");
const childProcess = require("child_process");
const path = require("path");
const { config, isDev } = require("./var");
const logger = require("./logger");
const { readdirSync } = require("fs");
const util = require("./util");

const srcDirPath = "../src";
const distDirPath = "../dist";
const libGuideDirPath = "../lib";
const libDirRelativePath = "/lib";
const depDirRelativePath = "/utils";

const typesDirPath = path.resolve(__dirname, `${distDirPath}/types`);
const fileName = config.outputFileName || "main";

const tscCommand = `tsc --declaration --declarationDir ${typesDirPath} --emitDeclarationOnly`;

const createFilePath = (dirPath, fileName) => {
  return path.resolve(__dirname, `${dirPath}/${fileName}`);
};

const getLibFileNames = () => {
  return readdirSync(
    path.resolve(__dirname, srcDirPath + libDirRelativePath),
  ).filter((f) => /\.(js|ts)$/.test(f));
  // .map((f) => f.slice(0, f.lastIndexOf("."))); /* ? */
};

const getDepNames = () => {
  return readdirSync(
    path.resolve(__dirname, srcDirPath + depDirRelativePath),
  ).filter((f) => /\.(js|ts)$/.test(f));
};

const buildList = [
  {
    entryPoints: [createFilePath(srcDirPath, "main.ts")],
    platform: "neutral",
    outfile: createFilePath(distDirPath, fileName + ".es.js"),
    bundle: false,
  },
  {
    entryPoints /* ? */: getLibFileNames().map((f) =>
      createFilePath(srcDirPath + libDirRelativePath, f),
    ),
    platform: "neutral",
    outdir /* ? */: path.resolve(__dirname, distDirPath + libDirRelativePath),
    bundle: false,
  },
  {
    entryPoints /* ? */: getDepNames().map((f) =>
      createFilePath(srcDirPath + depDirRelativePath, f),
    ),
    platform: "neutral",
    outdir /* ? */: path.resolve(__dirname, distDirPath + depDirRelativePath),
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
        "process.env": JSON.stringify(config.env || process.env),
      },
      outfile,
      outdir,
      plugins,
      // jsxFactory: config.jsxFactory,
      // jsxFragment: config.jsxFragment,
      // inject: ["./jsx-shim.ts"],
    });
    childProcess.execSync(tscCommand);
    logger.chan("Building", [entryPoints.join("; ")], outfile || outdir);
  } catch (e) {
    return console.error(e.message);
  }
};

const generateLibGuides = async () => {
  const topDirPath = path.resolve(__dirname, `${libGuideDirPath}`);
  await util.mkdir(topDirPath, true);
  const topPackageJson = {
    name: "@shirtiny/utils/lib",
    types: "../dist/types/lib/index.d.ts",
    main: "../dist/lib",
    module: "../dist/lib",
    exports: {
      "./*": {
        import: "./dist/lib/*.js",
      },
    },
    sideEffects: false,
  };
  util.writeFile(
    `${topDirPath}/package.json`,
    JSON.stringify(topPackageJson, null, "  "),
  );

  const libFileNames = getLibFileNames();
  libFileNames.map(async (libFileName) => {
    const libName = libFileName.slice(
      0,
      Math.max(libFileName.lastIndexOf("."), 0),
    );
    const childPackageJson = {
      name: `@shirtiny/utils/lib/${libName}`,
      types: `../../dist/types/lib/${libName}.d.ts`,
      main: `../../dist/lib/${libName}`,
      module: `../../dist/lib/${libName}`,
      sideEffects: false,
    };
    const dirPath = `${topDirPath}/${libName}`;
    const filePath = dirPath + "/package.json";

    const fileContent = JSON.stringify(childPackageJson, null, "  ");

    logger.log(`generate lib guide dir ${libName}... \n`);
    await util.mkdir(dirPath, true);
    util.writeFile(filePath, fileContent);
  });
};

const buildAll = async () => {
  logger.log("o(*^▽^*)┛ bundle, please wait...\n");
  const promises = buildList.map((item) => build(item));
  try {
    await Promise.all(promises);
    await generateLibGuides();
    logger.log("\n♪(^∇^*) done~☆!");
  } catch (e) {
    console.log(e.message);
  }
};

buildAll();
