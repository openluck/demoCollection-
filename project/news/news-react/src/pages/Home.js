/*
 * @Descripttion: 
 * @version: 
 * @Author: OpenLcuk
 * @Date: 2021-10-25 11:34:49
 * @LastEditors: OpenLcuk
 * @LastEditTime: 2021-11-01 09:47:21
 */
import React, { Component } from "react";
import '../static/css/Home.css'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsList: [
        {
          id: 1,
          name: '中国新闻网',
          imgSrc: 'http://i8.chinanews.com.cn/2013/home/images/logo.jpg'
        },
        {
          id: 2,
          name: 'qq新闻网',
          imgSrc: '//mat1.gtimg.com/pingjs/ext2020/newom/build/static/images/new_logo.png'
        },
        {
          id: 3,
          name: 'cctv新闻网',
          imgSrc: 'https://p3.img.cctvpic.com/photoAlbum/templet/common/DEPA1548732472557170/logo_shouyang_20190129.jpg'
        },
      ]
    }
    this.goNewsPage = this.goNewsPage.bind(this)
  }

  render() {
    return (
      <div>
        <div>新闻列表</div>
        <div>
          <ul>
            {/* <li>
              <img className="image-logo" src="" alt="qq_logo"></img>
            </li> */}
            {
              this.state.newsList.map(item => {
                return <li key={item.id} onClick={() => this.goNewsPage(item)}>
                  <img className="image-logo"
                    src={item.imgSrc}
                    alt={item.name}></img>
                  <span>{item.name}</span>
                </li>
              })
            }
          </ul>
        </div>
      </div>
    )
  }

  // 去新闻列表页 用箭头函数去写 
  goNewsPage(item) {
    const { id } = item;
    console.log(id);
    this.props.history.push('/ChinaNewFinance')
  }
}

export default Home