/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-21 14:40:45
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-21 14:43:49
 */
const request = require('request')

let url = 'https://m.chinanews.com/chinanews/getNewsList?language=chs&pageSize=15&searchType=1&dtp=16&isWap=yes&cname=cj&pageIndex=3&version_ch'

request(url, (err, response, body) => {
  console.log(body);
})