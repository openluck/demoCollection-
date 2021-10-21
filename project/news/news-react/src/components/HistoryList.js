/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-19 15:58:40
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-10-19 16:01:37
 */
import react from "react";

export default function HistoryList({ list }) {
  return (
    <ul>
      {
        list.map(item => (<li key={item.id}>{item.year}----{item.title}</li>))
      }
    </ul>
  )
}