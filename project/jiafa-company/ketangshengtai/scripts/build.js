/*
 * @Author: junjie.lean
 * @Date: 2020-06-17 16:51:24
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-09-07 19:20:34
 */

const spawn = require("cross-spawn");
const zipper = require("zip-local");
const chalk = require("chalk");
const package = require("./../package");

// process.on("unhandledRejection", (err) => {
//   // throw err;
// });

process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise 1111111111111111111111111111111", p, " reason: ", reason);
  // application specific logging, throwing an error, or other logic here
  process.exit(0)
});

let option = {
  env: {
    ...process.env,
  },
  cwd: process.cwd(),
  stdio: "inherit",
  encoding: "utf8",
  shell: process.platform == "win32",
};

console.log(chalk.hex("#00d684").bold("Build start, please wait..."));

let res = spawn.sync("npx", ["webpack", "--config", "./config/webpack.base.config"], {
  ...option,
});

// console.log(res);
console.log(chalk.hex("#00d684").bold("Zip start, please wait..."));

let hash = "";
for (let i = 0; i < 10; i++) {
  hash += Math.floor(Math.random() * 16).toString(16);
}

let zipName = `build${
  package.projectName ? "." + package.projectName : ""
}.${hash}.zip`;

zipper.sync.zip("./build").compress().save(zipName);

console.log(
  chalk.hex("#00d684").bold(`Zip completed, package name: "${zipName}"`)
);
