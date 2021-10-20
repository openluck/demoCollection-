class User{
    constructor(){
        this.userName = '小明'
        this.password = '123456'
    }
    showName(){
        console.log(`this.userName: ${this.userName}`)
    }
    showPwd(){
        console.log(`this.password: ${this.password}`)
    }
}

let u1 = new User()
console.log(u1)
u1.showName()
u1.showPwd()

