const webp = require('webp-converter');

const fs = require("fs")

const path = require("path")

const glob = require("glob")

webp.grant_permission();

const p = path.resolve(__dirname, "../src/assets/img")

const res = glob.sync(`${p}/**/*`);

const convertExt = ["jpg", "jpeg", "png"]

console.log(res);

for (let item of res) {
  const [filename, ext] = item.split(".");
  if (convertExt.includes(ext)) {
    const f = `${filename}.webp`;
    if (fs.existsSync(f)) {
      continue;
    }
    const result = webp.cwebp(item, f, "-q 80");
    result.then((response) => {
      console.log(response);
    });
  }
}

