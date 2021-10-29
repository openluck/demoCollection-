/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-29 14:21:11
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-29 14:31:28
 */
// https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=finance&srv_id=pc&offset=40&limit=20&strategy=1&ext={%22pool%22:[%22top%22],%22is_filter%22:10,%22check_type%22:true}
// https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=finance&srv_id=pc&offset=20&limit=20&strategy=1&ext={%22pool%22:[%22top%22],%22is_filter%22:10,%22check_type%22:true}
// https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=finance&srv_id=pc&offset=60&limit=20&strategy=1&ext={%22pool%22:[%22top%22],%22is_filter%22:10,%22check_type%22:true}
const request = require('request')
function getNewsData() {
  for (let i = 1; i <= 1; i++) {
    let url = 'https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=finance&srv_id=pc&offset=40&limit=20&strategy=1&ext={%22pool%22:[%22top%22],%22is_filter%22:10,%22check_type%22:true}';
    console.log('url', url + '----------------' + i);
    request({ url }, async (err, response, body) => {
      let resut = JSON.parse(body)
      let dataList = resut.data.list
      console.log(dataList);
    })
  }
}
getNewsData() 