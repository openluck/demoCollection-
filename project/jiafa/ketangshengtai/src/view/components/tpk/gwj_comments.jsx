import React, { Component } from "react";
import { SVG, IMG } from "../../components/tpk/base.jsx";
// import _x from "./../../../../js/_x/index";
import "../../../style/tpk/gwj_comments.css";
import { G } from "./../../../config/g";
import moment from 'moment'
import head from './../../../media/picture/default_head.png';
// const Format = _x.util.date.format;

class MyComments extends Component {
  renderCommentPic = info => {
    if (info.pictures) {
      if (info.pictures.length && info.pictures instanceof Array) {
        return info.pictures.map((item, index) => {
          return (
            <div className="gwj-comment-pic" key={index}>
              <IMG
                width="80px"
                height="70px"
                src={`${G.serverUrl}/pic/findById/${item}`}
              />
            </div>
          );
        });
      } else {
        return <div className="gwj-comment-pic" style={{ height: 70 }} />;
      }
    } else if (info.picId) {
      if (info.picId.length && info.picId instanceof Array) {
        return info.picId.map((item, index) => {
          return (
            <div key={index} className="gwj-comment-pic">
              <IMG
                width="80px"
                height="70px"
                src={`${G.serverUrl}/pic/findById/${item}`}
              />
            </div>
          );
        })
      }
    } else if (info.filePath) {
      if (info.filePath.length && info.filePath instanceof Array) {
        return info.filePath.map((item, index) => {
          return (
            <div key={index} className="gwj-comment-pic">
              <IMG
                width="80px"
                height="70px"
                src={`${G.serverUrl}/pic/findById/${item}`}
              />
            </div>
          );
        })
      }
    } else {
      return <div className="gwj-comment-pic" style={{ height: 70 }} />;
    }
    // }
  };

  render() {
    let { info, type } = this.props;
    // console.log("bofangy：", info);
    let mark = info.classTotalScore ? Number(info.classTotalScore) : null

    return (
      <div className="gwj-comments-box">
        <div className="gwj-comments">
          <div>
            {/* 头像可能有男女之分，需判断 */}
            <img src={head} />
          </div>
          <div className="gwj-comments-content">
            <div>{info.description || info.comment}</div>
            <div>
              {/* {
							info.pictures && info.pictures.length ?
									info.pictures.map((item, index) => (
											<div key={index} style={{ marginRight: '10px', display: 'inline-block' }} >
													<IMG width='80px' height='80px' src={`${G.serverUrl}/pic/findById/${item}`} />
											</div>
									))
									: null
					} */}
              {/* {
									info.picId ? <IMG width='80px' height='80px' src={`${G.serverUrl}/pic/findById/${info.picId}`} /> : null
							} */}

              {this.renderCommentPic(info)}
            </div>
            <div>
              <span>
                <SVG type="laoshi" />
                {info.teacherName || info.name || "-"}
              </span>
              <span>
                <SVG type="shijian-2" />
                {info.lastUpdateTime
                  ? moment(new Date(info.lastUpdateTime)).format('YYYY-MM-DD HH:MM:SS')
                  : "-"}
              </span>
              {this.props.commentStatus === "教研评课" ? (
                <span style={{ float: 'right' }}>
                  {/* <SVG type="teacher" /> */}
                  评分：
                  <span style={mark ? mark > 60 ? { color: '#26a5ff' } : { color: '#eb4058' } : {}}>{mark || "-"}</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default MyComments;
