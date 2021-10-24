const request = require('request')

let url = "https://channel.chinanews.com/cns/cjs/sh.shtml?pager=6&pagenum=13&t=13_32 "
request(url, (err, res, body) => {
  console.log(typeof body);
  // let bodyStr = body.toString() 
  let bodyObj = body.replace(/=/g, ':');
   let bodyBoj JSON.parse(bodyObj)
  console.log(bodyBoj);
  // let body1 = body.split("=")

})