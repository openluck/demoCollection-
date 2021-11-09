/**
 * 这是框架主页
 * 
*/

import React from 'react'
import {Route} from 'react-router-dom'
import layoutRoute from '../../router/layoutRoute'
import Header from './header'
import styles from './home.module.less'
export default class Home extends React.Component {

    render() {
        return (
            <div className={styles['page']}>
                <Header />
                <div className={styles['container']}>
                    {layoutRoute.map((item) => {
                        return (
                           <Route exact path={item.path} component={item.component} key={item.key}/>
                        )
                    })}
                </div>
            </div>
        )
    }
}