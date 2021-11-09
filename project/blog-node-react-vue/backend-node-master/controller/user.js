
// 
const User = require('../model/user')
const { UserCreateRule, UserUpdateRule, UserListRule } = require('../rule/userRule')
const { encryption, compared } = require('../utils/bcrypt')
const createToken = require('../utils/createToken')


// 注册
const register = async (req, res, next) => {
    console.log(req.body)
    const { username, password, nickname, isAdmin, avatar } = await UserCreateRule.validateAsync(req.body)
    const result = await User.findOne({ username })

    if (!result) {
        await User.create({
            username,
            password: encryption(password),
            nickname,
            isAdmin,
            avatar,
        })
    } else {
        return res.json({
            code: 102,
            msg: '用户名重复',
        })
    }

    return res.json({
        code: 200,
        msg: '注册成功',
    })
}




// 普通用户登录
const login = async (req, res, next) => {
    await UserCreateRule.validateAsync(req.body)
    const { username, password } = req.body
    const result = await User.findOne({ username })
    if (!result) {
        return res.json({
            code: 102,
            msg: '用户名不正确',
        })
    }

    if (!compared(password, result.password)) {
        return res.json({
            code: 103,
            msg: '密码不正确',
        })
    }


    // 生成token

    let token = createToken(result._id)

    return res.json({
        code: 200,
        data: { token },
        msg: '登录成功'
    })
}

// 管理员登录
const adminLogin = async (req, res, next) => {
    const { username, password } = await UserCreateRule.validateAsync(req.body)
    const result = await User.findOne({ username })
    if (!result) {
        return res.json({
            code: 102,
            msg: '用户名不正确',
        })
    }

    if (!compared(password, result.password)) {
        return res.json({
            code: 103,
            msg: '密码不正确',
        })
    }

    if (!result.isAdmin) {
        return res.json({
            code: 104,
            msg: '你不是管理员',
        })
    }

    // 生成token
    let token = createToken(result._id)
    return res.json({
        code: 200,
        data: { token },
        msg: '登录成功'
    })
}

// 获取用户列表

const list = async (req, res) => {
    const { data: id } = req.user
    let { limit, page, keyword } = await UserListRule.validateAsync(req.query)
    const skip = (page - 1) * limit
    const user = await User.findById(id)
    if (!user.isAdmin) {
        return res.json({
            code: 300,
            msg: '你不是管理员，无权获取列表'
        })
    }
    const reg = new RegExp(keyword, 'g')
    const result = await User.find().or([
        { username: { $regex: reg } },
        { nickname: { $regex: reg } }
    ])
        .limit(limit).skip(skip).sort({_id: -1})
    const count = await User.find().count().or([
        { username: { $regex: reg } },
        { nickname: { $regex: reg } }
    ])
    res.json({
        code: 200,
        count: count,
        msg: '用户列表',
        data: result
    })
}

// 获取个人信息

const info = async (req, res, next) => {
    const id = req.user.data
    try {
        const result = await User.findById(id)
        return res.json({
            code: 200,
            data: result,
            msg: '获取个人信息成功',
        })
    } catch (error) {
        return res.json({
            code: 300,
            msg: '获取不到用户信息',
        })
    }
}




const deleted = async (req, res, next) => {
    const { data: _id } = req.user
    const user = await User.findById(_id)
    if (!user.isAdmin) {
        return res.json({
            code: 300,
            msg: '你不是管理员，无权删除用户'
        })
    }
    const { id } = req.query
    if (!id) return res.json({ code: 101, msg: 'id为空' })
    const result = await User.remove({ _id: id })
    if (result.n === 1) {
        return res.json({
            code: 200,
            msg: '删除成功',
        })
    }
    return res.json({
        code: 300,
        msg: '删除失败',
    })
}


// 修改

const update = async (req, res, next) => {
    const { id } = req.body
    if (!id) return res.json({ code: 101, msg: 'id为空' })
    try {
        await UserUpdateRule.validateAsync(req.body)
    } catch (error) {
        return res.json({
            code: 101,
            msg: error.message,
        })
    }
    const result = await User.findByIdAndUpdate(id, { $set: req.body })
    if (!result) {
        res.json({
            code: 301,
            msg: '更新失败，检查id是否正确',
        })
    }
    res.json({
        code: 200,
        msg: '更新成功',
    })
}



module.exports = {
    adminLogin,
    login,
    register,
    info,
    deleted,
    update,
    list
}