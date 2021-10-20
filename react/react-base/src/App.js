/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-15 14:45:52
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-19 16:15:19
 */
import logo from './logo.svg';
import './App.css';

// redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

// hook
import History from './containers/History';
import DateSelect from './containers/DateSelect'

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        {/* <header className="App-header">
          test
        </header> */}
        <DateSelect />
        <History />
      </div>
    </Provider>

  );
}

export default App;
