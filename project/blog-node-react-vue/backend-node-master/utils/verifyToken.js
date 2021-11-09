const expressJWT = require('express-jwt');
const secret = 'hexuehui'; // 密钥，防止篡改

// 验证--放到最前面的use
const varifyToken = () => {
    return expressJWT({
        secret: secret,
        algorithms: ['HS256'], // 要加才能对
        // requestProperty:'auth',//自定义获取的信息位置，默认验证通过req.user获取token信息
        credentialsRequired: true // 是否需要证件
    }).unless({
        path: [
            '/api/user/login',
            '/api/user/register',
            '/api/user/adminLogin',
            '/api/common/uploadAvatar',
            '/api/common/uploadPoster',
            '/api/common/uploadPhoto',
            '/api/article/list',
            '/api/articleClassify/list',
            '/api/article/detail',
            '/api/album/list',
            '/api/album/photoList',
            '/api/record/list',
            '/api/recordTag/list',
            '/api/word/list',
        ] //除了这个地址，其他的URL都需要验证
    });
};

// 失败处理--放到最后一个app.use()
const errorToken = (err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        switch (err.code) {
            case 'credentials_required':
                return res.json({
                    code: 403,
                    msg: 'token为必传'
                })
            case 'invalid_token':
                if (err.message == 'jwt expired') {
                    return res.json({
                        code: 402,
                        msg: 'token已过期'
                    })
                }
            default:
                return res.json({
                    code: 401,
                    msg: 'token不正确'
                })
        }
    } else {
        next(err)
    }
};

module.exports = {
    varifyToken,
    errorToken
};
// 说明：
// token过期时的err值：
// {
//     "name": "UnauthorizedError", 所以我们可以用这个来判断是否验证失败
//     "message": "jwt expired",
//     "code": "invalid_token",
//     "status": 401,
//     "inner": {
//         "name": "TokenExpiredError",
//         "message": "jwt expired",
//         "expiredAt": "2017-08-03T10:08:44.000Z"
//     }
// }

// token无效时的err值：
// {
//     "name": "UnauthorizedError",
//     "message": "invalid signature",
//     "code": "invalid_token",
//     "status": 401,
//     "inner": {
//         "name": "JsonWebTokenError",
//         "message": "invalid signature"
//     }
// }