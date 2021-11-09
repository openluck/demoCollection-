/**
 * 这是文章的左边部分
 * 
*/

import React from 'react'
import styles from './aside.module.less';
import { RightOutlined } from '@ant-design/icons'

export default class Aside extends React.Component {

    constructor(props) {
        super(props)
    }
    handleClick (id){
        this.props.change(id)
    }
    render() {
        const { list, classify } = this.props
        return (
            <div className={styles.aside}>
                {
                    list.map((item, index) => {
                        return (
                            <div className={[styles['aside-item'], classify == item._id ? styles.active: ''].join(' ')} key={item._id} onClick={this.handleClick.bind(this, item._id)}>
                                <span className={styles['aside-item-text']}>{ item.name }</span>
                                <RightOutlined className={styles['aside-item-icon']} />
                            </div>
                        )
                    })
                }
               
            </div>
        )
    }
}