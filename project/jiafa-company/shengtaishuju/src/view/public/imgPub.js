/*
 * @Author: lxx 
 * @Date: 2020-05-14 17:44:03 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-07-30 10:15:43
 * 图片组件
 */
import React, { Component } from 'react'
import { Spin } from 'antd';
import SVG from './svg'
import Zmage from 'react-zmage'

export class IMG extends Component {
    constructor (props) {
      super(props)
      this.state = {
        success: !!this.props.src,
        loading: !!this.props.src,
        src: this.props.src,
        tipsshown: false,
        hastips: false
      }
      this.onImgError = this.onImgError.bind(this)
      this.onImgLoad = this.onImgLoad.bind(this)
    }
  
    UNSAFE_componentWillReceiveProps (nextProps) {
      if (nextProps.src !== this.props.src) {
        if (nextProps.src) {
          this.setState({
            loading: true,
            success: true
          })
        } else {
          this.setState({
            loading: false,
            success: false
          })
        }
      }
    }
  
    onImgError () {
      this.setState({
        success: false,
        loading: false
      })
    }
  
    onImgLoad () {
      this.setState({
        success: true,
        loading: false
      })
    }
  
    render () {
      var alt = this.props.alt || 'picture'; 
      var style = {};
      if (this.props.width) style.width = this.props.width
      if (this.props.height) style.height = this.props.height
  
      if (!this.props.width && !this.props.height) {
        style.width = '100%'
        style.height = '100%'
      }
  
      var content
  
      if (this.state.loading) {
        content = <Spin spinning={this.state.loading} wrapperClassName='xt-imgbox'>
          {
            this.state.success 
              ? this.props.isEnlarge 
                ? <Zmage onError={this.onImgError} onLoad={this.onImgLoad} src={this.props.src} style={style} />
                : <img onError={this.onImgError} onLoad={this.onImgLoad} src={this.props.src} style={style} />
              : <div className='xt-imgerror'><SVG type={alt} /></div>
          }
        </Spin>
      } else {
        content = this.state.success 
          ? this.props.isEnlarge 
            ? <Zmage src={this.props.src} style={style} />
            : <img src={this.props.src} style={style} />
          : <div className='xt-imgerror'><SVG type={alt} /></div>
      }
  
      return content
    }
  }