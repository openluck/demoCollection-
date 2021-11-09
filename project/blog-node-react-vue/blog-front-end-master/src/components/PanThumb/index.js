/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-11-09 14:42:50
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-09 15:32:00
 */
import React from 'react'
import styles from './PanThumb.module.css'


export default class PanThumb extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    width: '150px',
    height: '150px',
    zIndex: 1,
    image: ''
  }


  render() {
    const { zIndex, height, width, image, children } = this.props
    return (
      <div style={{ zIndex: zIndex, height: height, width: width }} className={styles['pan-item']}>
        <div className={styles['pan-info']}>
          <div className={styles['pan-info-roles-container']}>
            {children}
          </div>
        </div>
        <div style={{ backgroundImage: `url(${image.replace(/\\/g, '/')})` }} className={styles['pan-thumb']}></div>
      </div>
    )
  }
}