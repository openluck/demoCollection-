/*
 * @Author: junjie.lean
 * @Date: 2020-02-24 16:07:44
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2020-03-02 11:29:42
 */

/**
 * defaultComponentList独立文件
 */

export const defaultComponentWidgetList = [
  {
    componentName: "单行文本框",
    //0 表单标题;1 单行文本框;2 多行文本框;3 单选框;4 多选框;5 分值题;
    //但是 0 这种情况是不会通过表单列表来创建.
    componentType: 1,
    bgColor: "#f5b465"
  },
  {
    componentName: "多行文本框",
    componentType: 2,
    bgColor: "#9ea5f8"
  },
  {
    componentName: "单选题",
    componentType: 3,
    bgColor: "#8abcf4"
  },
  {
    componentName: "多选题",
    componentType: 4,
    bgColor: "#b0c362"
  },
  {
    componentName: "分值题",
    componentType: 5,
    bgColor: "#f09e9e"
  }
];

export const defaultComponentList = [
  //标题vd不能被注释,不能被清除
  {
    domType: 0, //0 表单标题; 1 单行文本框;2 多行文本框;3 单选框;4 多选框;5 分值题,-1 主观评价,写死;-2 整体评价,写死;
    domTitle: "标题", //展示给用户看到的标题
    domMark: "", //展示给用户看到的备注
    domID: "dom0", //DOM-id 单选框是否同组互斥也由此值控制
    domValue: ["新增评议表"]
  },
  {
    domType: -1,
    domID: "dom-1",
    domValue: [""]
  },
  {
    domType: -2,
    domID: "dom-2",
    domValue: [""]
  }
  //, {
  //   domType: 1,
  //   domTitle: "单行文本框",
  //   domMark: "单上输入框的副标题",
  //   domID: "1",
  //   domValue: [""],
  // },
  //{
  //   domType: 2,
  //   domTitle: "多行文本框",
  //   domMark: "",
  //   domID: "2",
  //   domValue: [""]
  // },
  // {
  //   domType: 3,
  //   domTitle: "单选框",
  //   domMark: "单选框测试",
  //   domID: "3",
  //   domValue: ["选项1", "选项2", "选项3"],
  //   defaultChecked: []
  // },
  // {
  //   domType: 4,
  //   domTitle: "复选框",
  //   domMark: "复选框测试",
  //   domID: "4",
  //   domValue: ["选项1", "选项2", "选项3"],
  //   defaultChecked: []
  // },
  // {
  //   domType: 5,
  //   domTitle: "分值题",
  //   domMark: "分数填写0-100之间的整数",
  //   domID: "5",
  //   domValue: [0]
  // }
];
