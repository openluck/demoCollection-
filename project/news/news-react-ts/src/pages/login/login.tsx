/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-11-17 15:09:12
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-17 15:51:26
 */
import { useState } from "react";
import ReactCanvasNest from "react-canvas-nest";

import { FromView } from "../../components/FormView/FormView";
export const LoginFrom = () => {
  const [theme, setTheme] = useState();

  const floatColor = theme === "default" ? "24,144,255" : "110,65,255";
  return (
    <div>
      <ReactCanvasNest
        config={{
          pointColor: floatColor,
          lineColor: floatColor,
          pointOpacity: 0.6,
        }}
        style={{ zIndex: 1 }}
      ></ReactCanvasNest>
      {FromView}
    </div>
  );
};
