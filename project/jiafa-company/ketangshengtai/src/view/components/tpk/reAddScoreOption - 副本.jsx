/*
 * @Author: JudyC 
 * @Date: 2017-09-11 18:14:14 
 * @Last Modified by: MinJ
 * @Last Modified time: 2020-11-16 17:28:47
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Input, Form, InputNumber, Button, message } from 'antd';
import { SVG } from './../../components/tpk/base.jsx';
import './../../../style/tpk/mj_reAddScoreOption.css';

const FormItem = Form.Item;
const { TextArea } = Input;

let uuid = 0;
class ReAddScoreOption extends Component {
  formRef = React.createRef();
  constructor() {
    super();
    this.state = {
      datas: []
    };
    this.total = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  };

  componentWillMount() {
    this.setState({
      datas: this.props.itemData
    });
    uuid = this.props.itemData.childModelList.length - 1;
  }

  componentDidMount() {
    // this.formRef.current.setFieldsValue({
    //   'evaluateModelNames': this.state.datas.evaluateModelName
    // });
    this.state.datas.childModelList.map((item, idx) => {
      // this.formRef.current.setFieldsValue({
      //   ["evaluateModelName-" + idx]: item.evaluateModelName,
      //   ["evaluateModelDescription-" + idx]: item.evaluateModelDescription,
      //   ["score-" + idx]: item.score
      // });
    });
  };

  /**
   * 删除键
   */
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    // const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      message.info('请至少保留一个评分子项', 2);
      return;
    }

    // can use data-binding to set
    // form.setFieldsValue({
    //   keys: keys.filter(key => key !== k),
    // });
  };

  /**
   * 增加键子项键
   */
  add = () => {
    uuid++;
    const { form } = this.props;
    // can use data-binding to get
    // const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    // form.setFieldsValue({
    //   keys: nextKeys,
    // });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.total > 100) {
      message.info('评价总分不能超过100分！', 2);
    } else {
      const { form } = this.props;
      // const keys = form.getFieldValue('keys');
      var evaluateModelNameArray = [];
      this.formRef.current.validateFields((err, values) => {
        if (!err) {
          keys.map((k, index) => {
            // evaluateModelNameArray.push(this.formRef.current.getFieldValue("evaluateModelName-" + k).trim());
          });
          var sortArray = evaluateModelNameArray.sort();
          var isRepeat = false;
          for (let i = 0; i < sortArray.length; i++) {
            if (sortArray[i] === sortArray[i + 1]) {
              isRepeat = true;
              break;
            }
          }
          if (isRepeat) {
            message.info('评价子项名重复', 2);
          } else {
            var commit = true;
            if (values.evaluateModelNames.trim() === '') {
              message.info('请填写评价大项名', 2);
              commit = false;
              return false;
            } else {
              var evaluateModelName = values.evaluateModelNames.trim();
              commit = true;
            }
            var childModelList = [];
            _.forIn(values, (val, key) => {
              var items = key.split('-');
              if (items.length > 1) {
                if (!childModelList[items[1]]) {
                  childModelList[items[1]] = {};
                }
                if (typeof (val) === 'string') {
                  if (val.trim() === '' && items[0] === 'evaluateModelName') {
                    message.info('请填写评价子项名', 2);
                    commit = false;
                    return false;
                  } else {
                    commit = true;
                    childModelList[items[1]][items[0]] = val.trim();
                  }
                } else {
                  childModelList[items[1]][items[0]] = val;
                }
              }
            });

            childModelList = childModelList.filter(t => t !== undefined && t !== null);
            var commentData = {
              evaluateModelId: this.props.itemData.evaluateModelId,
              evaluateModelName: evaluateModelName,
              evaluateModelDescription: '',
              childModelList: childModelList
            };
            if (commit) {
              this.props.submitData(commentData);
            };
          }
        }
      });
    }
  };

  /**
   * 取消按钮
   */
  handleCancel = () => {
    this.props.handleCancel();
  }

  render() {
    // const { getFieldValue } = this.formRef.current;
    // const { getFieldDecorator, getFieldValue } = this.formRef.current;
    var initialKey = [];
    this.props.itemData.childModelList.map((item, index) => {
      initialKey.push(index);
    });
    // getFieldDecorator('keys', { initialValue: initialKey });
    // const keys = getFieldValue('keys');
    const keys = initialKey;
    const formItems = keys.map((k, index) => {
      return (
        <div className="cjy-raso-childOpt" key={k}>
          <div className="cjy-raso-titleLine">
            <SVG type='quxiao1' onClick={() => this.remove(k)} />
            &nbsp;
            <span>评分子项：</span>
            {/* <FormItem>
              {getFieldDecorator('evaluateModelName-' + k, {
                rules: [
                  { required: true, message: '请输入评分子项' },
                  { transform: (value) => { transformedValue: value ? value.trim() : '' } }
                ],
              })(
                <Input className="cjy-raso-childName" maxLength={30} />
              )}
            </FormItem> */}
            <FormItem name={'evaluateModelName-' + k} rules={[
              { required: true, message: '请输入评分子项' },
              { transform: (value) => { transformedValue: value ? value.trim() : '' } }
            ]}>
              <Input className="cjy-raso-childName" maxLength={30} />
            </FormItem>

            {/* <FormItem>
              {getFieldDecorator('score-' + k, {
                rules: [{ required: true, message: '请输入评分' },
                { pattern: /^[1-9]\d*$/, message: '请输入正确评分' }]
              })(
                <InputNumber className="cjy-raso-score" maxLength={3} />
              )}
              &nbsp;
              <span>分</span>
            </FormItem> */}
            <FormItem name={'score-' + k} rules={[
              { required: true, message: '请输入评分' },
              { pattern: /^[1-9]\d*$/, message: '请输入正确评分' }
            ]}>
              <InputNumber className="cjy-raso-score" maxLength={3} />
              &nbsp;
              <span>分</span>
            </FormItem>
          </div>
          {/* <FormItem className="cjy-raso-scoreStanBox">
            <span>评分标准：</span>
            {getFieldDecorator('evaluateModelDescription-' + k, {})
              (
                <TextArea className="cjy-raso-scoreStan" maxLength="200" placeholder="输入请勿超过200字" />
              )}
          </FormItem> */}
        </div>
      );
    });

    this.total = 0;
    keys.forEach((k, index) => {
      // this.total += (getFieldValue("score-" + k) || 0);
    });

    return (
      <Form className="cjy-raso-addScore" onSubmit={this.handleSubmit}>
        {/* <FormItem className="cjy-raso-ScorePrtBox">
          <span>评分大项：</span>
          {getFieldDecorator('evaluateModelNames', {
            rules: [{ required: true, message: '请输入评分大项' },
            ],
          })(
            <Input maxLength={30} />
          )}
          <span className="cjy-raso-totalNum"><span>{this.total}</span>分</span>
        </FormItem> */}
        <div className="cjy-raso-scoreChildBox">
          {formItems}
        </div>
        <div className="cjy-raso-addBtnBox">
          <a href="javascript:;" onClick={this.add}>
            <SVG type='tianjia' />
            &nbsp;&nbsp;添加新子项</a>
        </div>
        <FormItem className="cjy-raso-footer">
          <Button className="cjy-raso-btn cjy-raso-save" htmlType="submit">保存</Button>
          <Button className="cjy-raso-btn cjy-raso-cancel" onClick={this.handleCancel}>取消</Button>
        </FormItem>
      </Form>
    );
  }
}
export default ReAddScoreOption;