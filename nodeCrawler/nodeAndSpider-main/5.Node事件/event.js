//  引入模块
//  事件模块
let events = require('events')
//  事件发送器
let emitter = new events.EventEmitter()

//  监听事件
emitter.on('someEvent', function(arg1,arg2){
    console.log('listener1','arg1','arg2')
})
emitter.on('someEvent', function(arg1,arg2){
    console.log('listener2','arg1','arg2')
})
emitter.on('someEvent', function(arg1,arg2){
    console.log('listener3','arg1','arg2')
})

//  发送事件
emitter.emit('someEvent','arg1参数','arg2参数')