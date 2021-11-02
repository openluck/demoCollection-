import React, { Component } from "react";
import { Input, Button, message } from "antd";
import { SVG } from "../../components/tpk/base.jsx";
import "../../../style/tpk/gwj_input.css";
import { request } from './../../../util/request_2.12';
// import util from "../../../../js/_x/index";
// const Request = util.util.request.request;
const { TextArea } = Input;

export default class MyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "", //输入框中的值
      url: [], //base64码
      isSubmit: false,      //是否已经点击提交按钮
    };
  }

  // componentDidUpdate(prevProps) {
  //     // console.log(prevProps.type);
  //     // console.log(this.props.type)
  //     if (prevProps.type !== this.props.type) {
  //         this.setState({ inputValue: '请输入评论' });
  //     }
  // }

  changeValue = value => {
    this.setState({
      inputValue: value
    });
  };

  submit = () => {
    // console.log(this.props.curriculumallId);
    this.setState({ isSubmit: true })
    let { curriculumallId } = this.props;
    let { url, inputValue } = this.state;
    if (!inputValue) {
      message.warning("评论内容不能为空，请输入评论内容！");
      this.setState({ isSubmit: false });
    } else if (url.length <= 7) {
      this.reqAddComment({
        curriculumallId: curriculumallId,
        description: inputValue,
        pictures: this.state.url
      })
        .then(result => {
          this.props.callback();
          this.setState({ url: [], inputValue: "", isSubmit: false });
        })
        .catch(err => {
          if (!err.result) {
            message.warning(err.msg, 3);
            this.setState({ isSubmit: false });
          }
        });
    } else {
      message.warning("一次最多上传7张图片！", 3);
      this.setState({ isSubmit: false });
    }
  };
  /**
   * 在教学检测下面评价部分，增加点评
   */
  reqAddComment = args => {
    console.log("this.props.:", this.props);

    if (this.props.type === "tea_submit") {
      // 老师的教学检查 和 教学反思的提交接口 ， 与管理员不同
      return new Promise((resolve, reject) => {
        if (!args.pictures || !args.pictures.length) {
          if (this.props.typeStatus) {
            // 教学反思才必须图片
            return reject({ result: false, msg: "至少需要一张图片!" });
          }
        }
        request(
          "api/web/TeachingReflection/upBatchFileAndComment",
          {
            // id
            curriculumallId: args.curriculumallId,
            // 评论信息
            comment: args.description,
            // 0 教学检查  1 教学反思
            examScoreTypeId: this.props.typeStatus,
            // 图片列表
            fileList: args.pictures
          },
          res => {
            if (res.result && res.code !== "500") {
              message.success("提交成功！");
              resolve(true);
            } else {
              message.warning(res.message);
            }
          },
          () => {
            message.error("接口报错，请联系管理员");
          }
        );
      });
    } else if (this.props.type === "tea_dp") {
      return new Promise((resolve, reject) => {
        if (!args.pictures || !args.pictures.length) {
          if (this.props.typeStatus) {
            // 教学反思才必须图片
            return reject({ result: false, msg: "至少需要一张图片!" });
          }
        }
        request(
          "api/web/research_job/add_comment",
          {
            // id
            uid: args.curriculumallId,
            // 评论信息
            comment: args.description,
            // 图片列表
            files: args.pictures
          },
          res => {
            if (res.result && res.code === "200") {
              message.success("提交成功！");
              resolve(true);
            } else {
              message.warning(res.message || "提交失败！");
            }
          },
          () => {
            message.error("接口报错，请联系管理员");
          }
        );
      });
    } else if (this.props.type === "tea_jydp") {
      // 教研评课 的点评
      return new Promise((resolve, reject) => {
        request(
          "api/web/research_job/add_comment",
          {
            uid: this.props.researchTeachId,
            comment: args.description,
            files: args.pictures
          },
          res => {
            if (res.result && res.code === "200") {
              message.success("提交成功！");
              resolve(true);
            } else {
              message.warning(res.message);
            }
          },
          () => {
            message.error("接口报错，请联系管理员");
          }
        );
      });
    } else if (this.props.type === "tea_stt") {
      // 随堂听课 的提交
      return new Promise((resolve, reject) => {
        request(
          "api/web/research_job/submit_listen_note",
          {
            uid: this.props.researchTeachId,
            note: args.description
          },
          res => {
            if (res.result && res.code === "200") {
              message.success("提交成功！");
              resolve(true);
            } else {
              message.warning(res.message || "提交失败");
            }
          },
          () => {
            message.error("接口报错，请联系管理员");
          }
        );
      });
    } else {
      // 管理员 教学检查 和 教学反思的提交接口
      return new Promise((resolve, reject) => {
        request(
          "api/web/teacommon/addcomment",
          {
            curriculumallId: args.curriculumallId,
            description: args.description,
            pictures: args.pictures
          },
          res => {
            if (res.result && res.code !== "500") {
              message.success("提交成功！");
              resolve(true);
            } else {
              message.warning(res.message);
            }
          },
          () => {
            message.error("接口报错，请联系管理员");
          }
        );
      });
    }
  };
  /**
   * 返回文件后缀
   * @param {*String} fileName 上传的文件名字
   */
  getFileSuffix = (fileName) => {
    if (typeof (fileName) === 'string' && fileName.indexOf('.') > -1) {
      let args = fileName.split('.');
      return args[args.length - 1];
    } else {
      alert('传入参数必须为文件名且不能为空且必须为字符串！');
    }
  }
  /**
   * input上传图片转为base64码
   */
  upLoadImgs = () => {
    document.getElementById("gwj_input_upload").onchange = e => {
      let files = e.target.files,
        burl = [];

      let fileName = this.getFileSuffix(files[0].name)
      console.log(files, files[0].name);
      if (fileName === 'png' || fileName === 'jpg' || fileName === 'jpeg' || fileName === 'gif') {
        let filesPromise = [];
        let { url } = this.state;
        for (let i = 0; i < files.length; i++) {
          filesPromise[i] = this.fileReaderPromise(files[i], burl);
        }

        Promise.all(filesPromise).then(data => {
          let flag = false;
          data.map(image => {
            if (!image) {
              flag = true;
            }
          });
          if (!flag) {
            this.setState(
              {
                url: [...url, ...burl]
              },
              function () {
              }
            );
          }
          document.getElementById("gwj_input_upload").value = '';
        });
      } else {
        message.warning('请上传图片文件');
      }
    };
  };

  fileReaderPromise = (file, burl) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        // console.log(e)
        //图片转base64码
        let newUrl = e.target.result;
        burl.push(newUrl);
        // console.log(burl);
        resolve(true);
      };
    });
  };

  /**
   * 图片删除
   */
  delImg = index => {
    let url = this.state.url;
    url.splice(index, 1);
    this.setState({ url });
  };

  render() {
    // console.log(this.props.curriculumallId)
    let { url, isSubmit } = this.state;
    return (
      <div className="gwj-input">
        <TextArea
          className="gwj-input-textArea"
          rows={3}
          placeholder="请输入评论..."
          maxLength="1000"
          value={this.state.inputValue}
          onChange={e => {
            this.changeValue(e.target.value);
          }}
        />
        {this.props.type === "tea_stt" ? null : (
          <div style={{ margin: "20px" }}>
            {url.length
              ? url.map((item, index) => (
                <div className="gwj-img" key={index}>
                  <img
                    className="gwj-showImg"
                    src={item}
                    onMouseEnter={this.show}
                    onMouseLeave={this.hide}
                  />
                  <span
                    className="gwj-hide"
                    onClick={() => this.delImg(index)}
                  >
                    <SVG type="gb" />
                  </span>
                </div>
              ))
              : null}
            <div className="gwj-upload" onClick={this.upLoadImgs}>
              <SVG type="tj" />
              <input
                type="file"
                id="gwj_input_upload"
                multiple
                accept="image/*"
              />
            </div>
          </div>
        )}

        <Button
          className="gwj-input-button"
          type="primary"
          onClick={this.submit}
          // disabled={isSubmit}
          loading={isSubmit}
        >
          提交
        </Button>
      </div>
    );
  }
}
