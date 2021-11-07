const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    console.log('start proxy')
    app.use( '/api', createProxyMiddleware({ target: 'http://test.xiandanmall.com'}));
};
