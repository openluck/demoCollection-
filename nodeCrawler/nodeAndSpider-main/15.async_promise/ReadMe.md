**写法的区别**

ES5正常写法

`getAjax(url,() => {})`

Promise

`get(url).then(() => {})`

async_await

```javascript
//	async await是语法题，实质运行时还是会转换成Promise
(async () => {
    let res = await get(url)
})()
```

总结：

·ES5和promise写法，主要区别在写法的不同，可以让回调函数，划分出去在.then的函数里去执行，使得代码更加灵活外，也可以将两个不同的参数，可以划分开来写。

·async和promise的区别，主要在于async是promise的语法糖，这种形式的写法可以在底层编译之后转换成promise写法。



**Promise实现原理**

promise需要实现的功能

```javascript
//	逻辑处理
function fn(resolve,reject){
    setTimeout(() => {
        if(true){
        	resolve()    
        }else{
            reject()
        }
    })
}
//	Promise实例化
let p1 = new Promise(fn)

//	正常执行
p1.then(function(res){
    document.body.style.background = 'greenyellow'
    console.log('这是调用成功做的事')
    console.log(res)
})

//	捕获所有异常
p1.catch(function(res){
    document.body.style.background = 'pink'
    console.log('这是调用失败做的事')
    console.log(res)
})

```

p1 Promise对象发送了异步操作，必然会有1个未来时间，在未来要执行。这个过程由传入的函数对象fn执行，函数fn里必然需要由成功执行和失败执行的函数。



1.创建类构造对象

```javascript
class LcPromise{
    //	构造器
    constructor(fn){
        //	将成功的时间函数集成在successList数组里
        this.successList = []
        //	这里将所有的失败函数集成到failList里
        this.failList = []
        //	pending,fullfilled,rejected
        this.state = 'pending'
        //	传入的函数对象(异步操作的函数内容)
        fn(this.resolve.bind(this), this.rejectFn.bind(this))
    }
}
```

构造函数的作用：

·声明成功函数防止的数组对象

·声明失败函数防止的数组对象

·定义初始化状态

·调用传入进行执行异步内容的函数(在未来成功时传入进去的成功函数，在未来失败是调用传入的失败函数)

2.传入成功或失败时需要调用的函数

```javascript
class LcPromise{
    //	构造器
    constructor(fn){
        //	将成功的时间函数集成在successList数组里
        this.successList = []
        //	这里将所有的失败函数集成到failList里
        this.failList = []
        //	pending,fullfilled,rejected
        this.state = 'pending'
        //	传入的函数对象(异步操作的函数内容)
        fn(this.resolve.bind(this), this.rejectFn.bind(this))
    }
   	//	函数执行
    then(successFn, failFn){
        //	捕获执行成功函数
        if(typeof successFn == 'function'){
            this.successList.push(successFn)
        }
        //	捕获执行失败函数
        if(typeof failFn == 'function'){
            this.failList.push(failFn)
        }
    }
    //	兜底，捕获执行失败函数
    catch(failFn){
        if(typeof failFn == 'function'){
            this.failList.push(failFn)
        }
    }
}
```

作用：

·将成功和失败的函数传入成功和失败的数组里



定义调用成功和失败的函数

```javascript
class LcPromise{
    //	构造器
    constructor(fn){
        //	将成功的时间函数集成在successList数组里
        this.successList = []
        //	这里将所有的失败函数集成到failList里
        this.failList = []
        //	pending,fullfilled,rejected
        this.state = 'pending'
        //	传入的函数对象(异步操作的函数内容)
        fn(this.resolve.bind(this), this.rejectFn.bind(this))
    }
   	//	函数执行
    then(successFn, failFn){
        //	捕获执行成功函数
        if(typeof successFn == 'function'){
            this.successList.push(successFn)
        }
        //	捕获执行失败函数
        if(typeof failFn == 'function'){
            this.failList.push(failFn)
        }
    }
    //	兜底，捕获执行失败函数
    catch(failFn){
        if(typeof failFn == 'function'){
            this.failList.push(failFn)
        }
    }
    //	调用成功函数
    resolveFn(res){
        //	更改状态
        this.state = 'fullfilled'
        //	循环调用全部成功函数
        this.successList.forEach(function(item,index){
            //	调用方法
            item(res)
        })
    }
    //	调用失败函数
    rejectFn(res){
        //	更改状态
        this.state = 'rejected'
        //	循环调用失败函数
        this.failList.forEach(function(item,index){
            item(res)
        })
        //	抛出错误
        throw Error(res)
    }
}
```

作用：

·成功时调用成功数组里所有的函数，失败时调用失败数组里所有的函数。



**应用**

******

如何将promise与async和await结合使用

典型异步读写的回调操作

```,
fs.readFile(path, {flag:'r', encoding:'utf-8'},function(err,data){
	if(err){
		//	读取有错误
		reject(err)
	}else{
		//	读取无错误，成功
		resolve(data)
	}
})
```

转换成promise对象

```javascript
new Promise(function(resolve, reject){
    fs.readFile(path,{flag:'r',encoding:'utf-8'},function(err,data){
        if(err){
            reject(err)
        }else{
            resolve(data)
        }
    })
})
```

函数封装promise对象，方便调用

```javascript
function fsRead(path){
    return new Promise(function(resolve,reject){
        fs.readFile(path,{flag:'r',encoding:'utf-8'},function(err,data){
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
}
```

使用，promise写法

```javascript
p1 = fsRead(path)	//就可以得到promise对象
p1.then(function(data){
    console.log(`输出数据：${data}`)
})
p1.catch(function(err){
    console.log(`读取出错：${err}`)
})
```

async_await写法

```javascript
(async () => {
    let data = awit fsRead(path)
})()
```

异步async函数调用之后也是一个promise对象

```javascript
(async () => {
    async function test(){
        //	异步读取数据
        let data = await fsRead(path)
        return data
    }
    //	异步函数调用后，也是一个promise对象
    let p = test()
    p.then((data) => {
        console.log(data)
    })
})()
```