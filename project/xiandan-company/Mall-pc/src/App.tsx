import React from 'react';
import Router from './router';
import WebFooter from "./component/WebFooter";
import WebHeader from "./component/WebHeader";
import './App.css';

function App() {
  return (
    <div className="App">
        <WebHeader/>
        <Router />
        <WebFooter/>
    </div>
  );
}

export default App;
