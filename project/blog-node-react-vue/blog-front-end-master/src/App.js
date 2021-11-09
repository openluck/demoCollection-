/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-09 14:42:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-09 15:31:20
 */
/**
 *  这是react组件的最底部
 */
import Router from './router/index';
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import 'antd/dist/antd.css'

export default function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <Router></Router>
        </ConfigProvider>

    )
}
