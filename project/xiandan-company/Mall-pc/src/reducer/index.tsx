import { combineReducers } from 'redux';

const getUser = function(state:number = 1) {
    return  state + 1;
}
// 搜索商品的关键字
const searchText = function(state:string, action:{type:string, value:string}) {
    switch (action.type) {
        case "SEARCH": return action.value;
        default: return "";
    }
}

export default combineReducers ({
//    把不同reduce函数作为value传入，生成一个最终的reduce函数
//    参数形式potato:potatoReduce函数
//    return {key：{},...,key:{}}
    getUser,
    searchText,
})