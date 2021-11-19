/*
 * @Descripttion:
 * @version:
 * @Author: OpenLcuk
 * @Date: 2021-11-19 09:15:34
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-19 13:21:42
 */
import React, { useEffect, FC, useState } from 'react'
import Child from './childCom/child1'

interface newsListProps {
  count: number;
}

const News: FC = () => {
  const [count, setCount] = useState<number>(0)
  const [robotUrl, setRobotUrl] = useState<any>([])
  const [username, setUsername] = useState<string>('艾莱客斯')

  // 副作用钩子
  useEffect(() => {
    document.title = `${count}次`
  }, [])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users').then((response) =>
      response.json().then((data) => {
        setRobotUrl(data)
      })
    )
  },[])

  return (
    <div>
      <p>你点击了{count}次</p>
      <button onClick={() => setCount(count + 1)}>click</button>
     <Child username={username}></Child>
    </div>
  )
}

export default News
