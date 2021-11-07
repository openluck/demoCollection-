// require modules
const path = require("path")
const shell = require('shelljs');

const type = process.argv[2];

const nodeModulesPath = path.resolve(__dirname, "../node_modules/")

const tencentPkgPath = path.resolve(__dirname, "../node_modules/@tencent")

const workspace = path.resolve(__dirname, "../")

const filename = "@tencent.zip"

const outpath = path.resolve(__dirname, `../${filename}`)


const args = ["--zip", "--unzip"]

function zipHandle() {
  const isExist = shell.test('-f', outpath);
  if (isExist) {
    shell.rm(outpath);
  }
  try {
    shell.cd(nodeModulesPath)
    const ret = shell.exec(`zip -q -r -D @tencent.zip @tencent`, {
      async: false,
    })
    if (ret.code !== 0) {
      console.error("压缩失败", ret.stdout);
      shell.exit(1)
    }
    shell.mv(filename, workspace)
    console.log("压缩成功, 生成 @tencent.zip 文件")
  } catch (error) {
    console.error(error);
  }
}

function unzipHandle() {
  const isExist = shell.test('-f', outpath);
  if (isExist) {
    shell.exec(`unzip -q @tencent.zip -d ${nodeModulesPath}`, {
      async: false
    })
    return;
  }
  throw new Error("zip 文件不存在")
}

function main() {
  if (!args.includes(type)) {
    console.log("error args; args must in [--zip, --unzip]")
    return
  }

  if (type === "--zip") {
    zipHandle();
  } else {
    unzipHandle()
  }
}

main();
