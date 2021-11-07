import React, { Component } from 'react';
import { Table, Button, InputNumber, message } from 'antd';
import '../../../style/tpk/gwj_form.css'
import { G } from '../../../config/g';
import { request} from '../../../util/request_2.12';
// import util from '../../../../js/_x/index';
// const Request = util.util.request.request;

export default class MyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreArr: [],
      // 总分
      totalScore: 0,
      isComment: false,
      dataSource: []
    }
  }

  componentDidUpdate() {
    let { dataSource } = this.props;
    let { scoreArr } = this.state;
    let data = [];
    if (dataSource && dataSource.length) {
      dataSource.map(item => {
        data.push({ evaluateModelId: item.evaluateModelName2Id, score: 0 });
      })
    }

    if (scoreArr.length !== dataSource.length) {
      this.setState({ scoreArr: data })
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.dataSource !== preState.dataSource) {
      let totalScore = 0;
      nextProps.dataSource.map((item) => {
        if (item.value) {
          totalScore += item.value
        }
      })
      return {
        totalScore
      }
    }
    return null;
  }

  // 打分栏change
  onChange = (index, value) => {
    let scoreArr = this.state.scoreArr;
    scoreArr[index].score = value;
    let totalScore = 0;

    this.setState({
      scoreArr: scoreArr,
    })
  }

  // 提交btn
  submit = () => {
    if (!this.props.isComment && !this.state.isComment) {
      this.reqAddScore({
        curriculumallId: this.props.curriculumallId,
        evaluateDetailList: this.state.scoreArr
      })
    } else {
      message.warning('已评分！');
    }
  }

  renderContent = (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    }
    obj.props.rowSpan = row.len;
    return obj;
  }

  // 渲染得分栏的input
  renderScore = (text, row, index) => {
    return <InputNumber
      min={0}
      max={row.score}
      maxLength={4}
      disabled={this.props.isComment || this.state.isComment}
      value={
        this.props.isComment ? row.value :
          this.state.scoreArr.length ? this.state.scoreArr[index].score : 0
      }
      onChange={(value) => this.onChange(index, value)}
    />
  }

  // 提交评分内容
  reqAddScore = (args) => {
    let url = '', params = {},
      list = args.evaluateDetailList;
    list.map(item => {
      item.score = item.score ? item.score : 0;
    })
    if (G.baseinfo.roleLevel === 1 || G.baseinfo.roleLevel === 2) {
      url = 'api/web/teacommon/add_evaluate_detail'
      params = {
        "curriculumallId": this.props.curriculumallId,
        "evaluateDetailList": args.evaluateDetailList
      }
    } else {
      url = 'api/web/research_job/add_teach_score',
        params = {
          "uid": this.props.researchTeachId,
          "evaluateDetailList": args.evaluateDetailList
        }
    }
    // console.log(params);

    request(url, params, (res) => {
      if (res.result && res.code === '200') {
        this.setState({ isComment: true })
        message.success('提交成功！');
      } else {
        message.warning(res.message);
      }
    }, () => {
      message.error('接口报错请联系管理员！');
    })
  }

  totalScore() {
    let scoreArr = this.state.scoreArr;
    let totalScore = 0;
    scoreArr.map(item => {
      totalScore += item.score
    })
    return totalScore
  }

  render() {
    const columns = [{
      title: '评价大项',
      dataIndex: 'evaluateModelName1',
      render: this.renderContent,
      width: 100
    }, {
      title: '评价子项',
      dataIndex: 'evaluateModelName2',
      width: 180
    }, {
      title: '评价标准',
      dataIndex: 'evaluateModelDescription',
    }, {
      title: '分值',
      dataIndex: 'score',
      width: 60
    }, {
      title: `得分(总分 ${this.props.isComment ? this.state.totalScore : this.totalScore()
        })`,
      key: 'value',
      render: this.renderScore,
      width: 130
    }];
    let { dataSource } = this.props;
    // console.log(dataSource);

    return (
      <div className="gwj-table-box">
        <Button
          type="primary"
          onClick={this.submit}
          className="gwj-table-button"
          disabled={dataSource.length ? false : true}
        >
          提交
                      </Button>
        <Table
          className="gwj-table"
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    );
  }
}