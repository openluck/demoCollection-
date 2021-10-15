/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-10-15 15:52:03
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-15 16:52:26
 */
import React from "react";

// interface
export const Header = () => {
  return (
    <div>
      <div
        style={{
          height: "30px",
          background: "#000",
          color: "#fff",
        }}
      >
        这是头部
      </div>
    </div>
  );
};

// import React, { useState } from "react";

// export default function Button() {
//   const [buttonText, setButtonText] = useState("Click me,   please");

//   function handleClick() {
//     return setButtonText("Thanks, been clicked!");
//   }

//   return <button onClick={handleClick}>{buttonText}</button>;
// }
