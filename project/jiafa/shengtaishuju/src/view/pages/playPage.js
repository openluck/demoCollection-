/*
 * @Author: lxx 
 * @Date: 2020-07-23 16:29:32 
 * @Last Modified by: lxx
 * @Last Modified time: 2021-03-22 09:25:32
 * 课堂明细 
 */
import React, { Component } from 'react'
import { connect } from "react-redux";
import { Button, message } from "antd"
import ClassSituation from './../components/video/classSituation';
import './../../style/ll-playPage.scss';
import { ll_getClassDetailsStatus, ll_getClassDetailsInfo, lxx_init, lxx_getReplyInfo, lxx_getTeaImgs, lxx_getStuImg } from './../../redux/ll-playPage.reducer'
import ViedoInfo from './../components/video/videoInfo'
import ImgShow from './../components/video/imgShow'
import ImgStuShow from './../components/video/imgStuShow'
import ImgTeaShow from './../components/video/imgTeaShow'
import SVG from './../public/svg';
import BackPub from './../public/backPub';
import G from './../../config/g';
import { request } from './../../util/request'

@connect(state => state, { ll_getClassDetailsStatus, ll_getClassDetailsInfo, lxx_init, lxx_getReplyInfo, lxx_getTeaImgs, lxx_getStuImg })
class PlayPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      baseUrl: ''
    };
  }

  componentDidMount() {
    if (G.ISCED_setInfo && G.ISCED_setInfo.dataAnalyze === "1") {
      this.getJumpUrl()
    }
    let claRoomId = this.props.match.params.claRoomId;
    this.props.ll_getClassDetailsStatus(claRoomId);
    this.props.lxx_getStuImg(claRoomId);
    // this.props.ll_getClassDetailsImg(claRoomId);
    this.props.ll_getClassDetailsInfo(claRoomId)
    this.props.lxx_getReplyInfo(claRoomId)
    this.props.lxx_getTeaImgs(claRoomId)
    this.nodebox.addEventListener("scroll", this.scroll)
  }

  componentWillUnmount() {
    this.props.lxx_init();
    this.nodebox.removeEventListener('resize', () => {
      this.scroll()
    })
  }

  scroll = (e) => {
    let top = e.target.scrollTop
    if (top > 100) {
      this.setState({
        isShow: true
      })
    } else {
      this.setState({
        isShow: false
      })
    }
  }

  /**
   * 获取AI跳转部署地址
   */
  getJumpUrl = () => {
    request('api/public/getOutsideUrl', {}, res => {
      if (res.code === "200" && res.result) {
        this.setState({
          baseUrl: res.data
        })
        console.log(`${res.data}#/?token=${G.ISCED_token}&orgcode=${G.ISCED_orgcode}&courseId=${this.props.match.params.claRoomId}&path=classAnalyse`)
      }
    })
  }

  /**
   * 跳转到其他系统
   */
  jumpOther = () => {
    let { baseUrl } = this.state
    if (baseUrl) {
      window.open(`${baseUrl}#/?token=${G.ISCED_token}&orgcode=${G.ISCED_orgcode}&courseId=${this.props.match.params.claRoomId}&path=classAnalyse`)
      // window.open(`http://localhost:3000#/?token=${G.ISCED_token}&orgcode=${G.ISCED_orgcode}&courseId=${this.props.match.params.claRoomId}&path=classAnalyse`)
    } else {
      message.warning("AI分析地址获取错误，请联系管理员")
    }

  }

  render() {
    let { stuOnAttRate, frontSeatRate, sleepRate,
      identifyResults, detailsInfo, teaImgs,
      stuImgs, loading, replyInfo } = this.props.ll_playPage_reducer;
    // let data= sessionStorage.getItem('content')||[];
    let { isShow } = this.state
    let data = G.ISCED_content || []
    return (
      <div className='ll-playPage' ref={nodebox => this.nodebox = nodebox} >
        <div ref={node => this.node = node}>
          <BackPub content={data} />
          {
            G.ISCED_setInfo && G.ISCED_setInfo.dataAnalyze === "1"
              ? <Button
                className="lxx-show-btn"
                type="primary"
                onClick={this.jumpOther}
              >
                查看AI教学分析
              </Button>
              : null
          }
        </div>
        <ViedoInfo
          data={detailsInfo}
          claRoomId={this.props.match.params.claRoomId}
        />
        <div className='ll-pp-title' ><div></div>课堂情况</div>
        <ClassSituation
          stuOnAttRate={stuOnAttRate}
          frontSeatRate={frontSeatRate}
          sleepRate={sleepRate}
          identifyResults={identifyResults}
          detailsInfo={detailsInfo}
          loading={loading}
          replyInfo={replyInfo}
        />
        <div className='ll-pp-title'><div></div>课堂图片</div>
        <ImgTeaShow
          name="教师考勤"
          data={teaImgs}
          style={{ marginBottom: '20px' }}
        />
        <ImgStuShow
          data={stuImgs}
        />
        {/* <ImgShow 
                    name="学生到课率/前排就坐率/低头率"  
                    data={stuImgs} 
                    style={{}}
                /> */}
        {
          isShow
            ? <div className='ll-toTop' onClick={() => { this.node.scrollIntoView() }}>
              <SVG type='fanhuidingbu' />
              <div>回到顶部</div>
            </div>
            : null
        }

      </div>
    );
  }
}

export default PlayPage;
