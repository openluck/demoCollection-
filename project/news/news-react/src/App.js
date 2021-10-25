/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-15 14:45:52
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-25 15:37:21
 */
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';

// redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

// hook
import History from './containers/History';
import DateSelect from './containers/DateSelect'

// pages  组件名 必须大写
import Xinhua from './pages/Xinhua'
import ChinaNewFinance from './pages/chinaNewFinance'
import Home from './pages/Home'
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Route path="/" exact component={Home}></Route>
          <Route path="/ChinaNewFinance" exact component={ChinaNewFinance}></Route>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
