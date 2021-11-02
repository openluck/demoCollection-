import { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const getList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([6, 7, 8, 9, 10]);
    }, 3000);
  });
};

function App() {
  const [data, setData] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    (async () => {
      const data = await getList();
      console.log("data", data);
      setData(data);
    })();
  },[]);

  return (
    <div className="App">
      {data.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}

export default App;
