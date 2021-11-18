/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-11-16 13:41:36
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-16 15:07:52
 */
import * as React from "react";

interface IProps {
  logo?: string;
  className?: string;
  alt?: string;
}

export const Logo = (props: IProps) => {
  const { logo, className, alt } = props;

  return <img src={logo} className={className} alt={alt}></img>;
};
