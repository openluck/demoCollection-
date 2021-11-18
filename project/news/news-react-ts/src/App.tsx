/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-21 13:37:01
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-18 17:13:49
 */
import React, { FC } from "react";
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Login from "../src/pages/login";

const App: FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>
);

export default App;
