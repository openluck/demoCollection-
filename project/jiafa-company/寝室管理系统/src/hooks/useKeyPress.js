/*
 * @Author: junjie.lean
 * @Date: 2020-01-09 16:09:35
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2021-02-18 16:40:36
 */

import React, { useEffect, useState } from "react";

/**
 * @description 按键监控
 * @param {number}
 * @returns {boolean}
 */
export const useKeyPress = (keyCode) => {
  const [isCheckedPass, setCheckedPass] = useState(false);

  const keydownHandle = (e) => {
    if (e.keyCode === keyCode) {
      console.log("key down at:", e.keyCode);
      setCheckedPass(true);
    }
  };

  const keyupHandle = (e) => {
    if (e.keyCode === keyCode) {
      setCheckedPass(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownHandle);
    document.addEventListener("keyup", keyupHandle);

    return () => {
      document.removeEventListener("keydown", keydownHandle);
      document.removeEventListener("keyup", keyupHandle);
    };
  }, []);

  return isCheckedPass;
};
