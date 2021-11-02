/*
 * @Author: junjie.lean
 * @Date: 2020-04-16 17:27:05
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-01 09:48:13
 */

const isDev = process.env.NODE_ENV === "development";

const G = {};

if (isDev) {
  G.dataService = "//10.20.5.196:12128";
  // G.dataService = "http://10.10.0.110:12128";
} else {
  //   G.dataService = window.location.origin + "/jf_exesm";
  G.dataService = window.location.origin + "";
}

window.G = G;

export default G;
