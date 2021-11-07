import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

import rootReducer from '../reducer';

const initializeState = {
//    保存需要的全局变量

};

const store = createStore(rootReducer, initializeState, applyMiddleware(thunk));

export default store;