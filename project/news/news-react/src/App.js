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

// pages
import Xinhua from './pages/Xinhua'
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
      </div>
    </Provider>

  );
}

export default App;
