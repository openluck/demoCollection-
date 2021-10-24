/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-15 14:45:52
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-21 14:33:10
 */
import logo from './logo.svg';
import './App.css';

// redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

// hook
import History from './containers/History';
import DateSelect from './containers/DateSelect'

// pages  组件名 必须大写
import Xinhua from './pages/Xinhua'
import ChinaNewFinance from './pages/chinaNewFinance'
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        {/* <header className="App-header">
          test
        </header> */}
        {/* <DateSelect />
        <History /> */}
        <Xinhua />
        <ChinaNewFinance />
      </div>
    </Provider>

  );
}

export default App;
