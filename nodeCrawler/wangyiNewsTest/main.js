/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-18 15:46:30
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-18 17:01:38
 */
const request = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const path = require("path");
const fs = require("fs");
const newsList = [];
// encoding: null 必须加，不然的话 request就给你转码了
request(
  { url: "https://hunan.news.163.com/", encoding: null },
  (err, res, body) => {
    let html = iconv.decode(body, "gbk");
    // cheerio
    let $ = cheerio.load(html, { decodeEntities: false });
    $(".news-feature").each(function (index, elem) {
      let $elem = $(elem);
      $elem.find("a").each(function (index, e) {
        const $e = $(e);
        const title = $e.text();
        console.log("title", title);
        const href = $e.attr("href");
        const hot = $e.parents("h5").length > 0;
        newsList.push({
          title,
          href,
          hot,
          tag: "网易新闻",
        });
      });
    });
    console.log("newsList", newsList);
  }
);
