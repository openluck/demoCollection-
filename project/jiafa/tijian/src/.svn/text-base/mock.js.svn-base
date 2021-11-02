const Mock = require('mockjs')


const login = function() {
    const data = {
        code: '200',
        message: 'success',
        result: true,
        data: {
            token: 'qwertyuiopasdfghjklzxcvbnm'
        }
    }
    return data;
};


Mock.mock('/login', 'post', login)


