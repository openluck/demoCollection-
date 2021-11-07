/**
 * @description 验证规则
 * @date 2020-12-8 16:58:33
 * */


import api from '@/http/api';

const { WorkOrderApply : { verifyBmhIsUnique } } = api;
import IdCardValidate from "./IDcheck";

// const idCard = sessionStorage.getItem("sfzh");
// 调用接口验证报名号是否唯一
const verify = async (data) => {
  return await verifyBmhIsUnique(data);
}

/**
 * @description 从身份证号码中获取出生日期和性别
 * @param {idCard}
 * @returns {birth} YYYYMMDD
 * @returns {sex} 1男 2女
 */
const getBirthdayAndSexByIdCard = idCard => {
  const num = idCard.trim();
  let birth = "";
  let sex = "";
  // 15位
  if (num.length == 15) {
    birth = num.substring(6, 12);
    birth = "19" + birth;
    birth = birth.substring(0, 4) + birth.substring(4, 6) + birth.substring(6);
    sex = parseInt(num.substring(14, 1),10) % 2 ? "1" : "2";
  } else {
    // 18位
    birth = num.substring(6, 14);
    birth = birth.substring(0, 4) + birth.substring(4, 6) + birth.substring(6);
    sex = parseInt(num.substring(17, 1),10) % 2 ? "1" : "2";
  }
  return {
    birth,
    sex
  }
}

// 出生日期
const validateBirth = (rule, value, callback) => {
  if (!value) return callback(new Error("请选择出生日期"));
  const value1 = value;
  // 未修改的身份证号码
  const oldIdCard = sessionStorage.getItem("Osfzh");
  // 修改过后的身份证号码
  const newIdCard = sessionStorage.getItem("Nsfzh");

  const res = getBirthdayAndSexByIdCard(oldIdCard);
  
  console.log('oldIdCard, newIdCard',oldIdCard ,newIdCard);
  if(newIdCard && oldIdCard !== newIdCard){
    callback();
    return
  }
  
  if(typeof value1 === "string"){
    if (res.birth !== value1) {
      callback(
        new Error("检测到出生日期与身份证号码不匹配")
      );
    } else {
      callback();
    }
  } else {
    const value2 =  value1.format('YYYYMMDD');
    if (res.birth !== value2) {
      callback(
        new Error("检测到出生日期与身份证号码不匹配")
      );
    } else {
      callback();
    }
  callback();
  }
};

// 性别
const validateSex = (rule, value, callback) => {
  if (!value) return callback(new Error("请选择性别"));

  // 未修改的身份证号码
  const oldIdCard = sessionStorage.getItem("Osfzh");
  // 修改过后的身份证号码
  const newIdCard = sessionStorage.getItem("Nsfzh");

  const res = getBirthdayAndSexByIdCard(oldIdCard);

  console.log('oldIdCard, newIdCard',oldIdCard ,newIdCard);
  if(newIdCard && oldIdCard !== newIdCard){
    callback();
    return
  }

  if (res.sex !== value) {
    callback(
      new Error("检测到性别与身份证号码不匹配")
    );
  }
  callback();
};


// 验证报名号是否唯一  
const validateBmh = async (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入报名号"));
  }
  const exId = window.sessionStorage.getItem("exId");
  const oldBmh = window.sessionStorage.getItem("bmh");
  const bmh = value;
  if(oldBmh === bmh){
    return
  }
  const res = await verify({exId,bmh});
  if(res.code !== "200"){
    callback(
      new Error("此报名号已存在，请核对后再行修改")
    );
  }
}

// 身份证号码验证
const validateIDNumber = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入身份证号码"));
  }
  if (!IdCardValidate(value)) {
    callback(
      new Error("身份证号码格式错误！")
    );
  }
  callback();
};

// 手机号码验证
const validatePhoneNumber = (rule, value, callback) => {
  // const reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
  const reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
  // if (!value) {
  //   return callback(new Error("请输入电话号码！"));
  // }
  if(value){
    if (!reg.test(value)) {
      callback(
        new Error("电话号码号码格式错误！")
      );
    }
  }
  callback();
}

// 座机号码验证
const validatezjNumber = (rule, value, callback) => {
  const reg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
  // if (!value) {
  //   return callback(new Error("请输入座机号码！"));
  // }
  if(value){
    if (!reg.test(value)) {
      callback(
        new Error("座机号码号码格式错误！")
      );
    }
  }
  callback();
}

// 验证长度
const validateLength = (rule, value, callback) =>{
  if (!value) {
    return callback(new Error("请输入内容 , 不超过80个字符"));
  } else if (value.length > 80) {
    callback(
      new Error(
        `您已超过${value.length - 80}个字符`
      )
    );
  }
  callback();
}

const rules = {
  // idCard: () => { return idCard = sessionStorage.getItem("sfzh")},
  // 报名号
  bmh: [
    { required: false, validator: validateBmh, trigger: "blur" },
    { max: 14, message: "报名号不超过14位", trigger: "blur" },
  ],
  // 姓名
  xm: [
    { required: false, message: "请输入姓名", trigger: "blur" },
    { max: 40, message: "姓名不超过40位", trigger: "blur" },
  ],
  // 报名序号
  bmxh: [
    { required: false, message: "请输入报名序号", trigger: "blur" },
    { max: 4, message: "报名序号不超过4位", trigger: "blur" },
  ],
  // 区县代码
  xqdh: [
    { required: false, message: "请输入区县代码", trigger: "blur" },
    { max: 4, message: "区县代码不超过4位", trigger: "blur" },
  ],

  // 身份证号码
  sfzh: [{ required: false, validator: validateIDNumber, trigger: "blur" }],

  // 性别
  xbdm: [{ required: false, validator: validateSex, trigger: ["blur","change"] }],
  // 出生日期
  csrq: [{ required: false, validator: validateBirth, trigger: "change" }],
  // 民族
  mzdm: [{ required: false, message: "请选择民族", trigger: "blur" }],
  // 考试类型
  kslxdm: [{ required: false, message: "请选择考试类型", trigger: "blur" }],
  // 科类
  kldm: [{ required: false, message: "请选择科类", trigger: "blur" }],
  // 户籍地址
  hjdz: [
    { required: false, message: "请输入户籍地址", trigger: "blur" },
    { max: 100, message: "不超过100个字符", trigger: "blur" },
  ],
  // 户籍性质
  hjxzdm: [{ required: false, message: "请选择户籍性质", trigger: "blur" }],
  // 应往届
  ywjdm: [{ required: false, message: "请选择应往届", trigger: "blur" }],
  // 考生类别
  kslbdm: [{ required: false, message: "请选择考生类别", trigger: "blur" }],

  // 政治面貌
  zzmmdm: [{ required: false, message: "请选择政治面貌", trigger: "blur" }],
  // 报名点
  bmddm: [
    { required: false, message: "请输入报名点", trigger: "blur" },
    { max: 6, message: "报名点不超过6位", trigger: "blur" },
  ],
  // 毕业类别
  bylbdm: [{ required: false, message: "请选择毕业类别", trigger: "blur" }],
  // 毕业学校代码
  byxx: [
    { required: false, message: "请输入毕业学校代码", trigger: "blur" },
    { max: 7, message: "毕业学校代码不超过7位", trigger: "blur" },
  ],
  // 毕业学校名称
  byxxmc: [
    { required: false, message: "请输入毕业学校名称", trigger: "blur" },
    { max: 30, message: "毕业学校名称不超过30位", trigger: "blur" },
  ],
  // 应试外语
  yswy: [{ required: false, message: "请选择应试外语", trigger: "blur" }],
  // 职教类别
  zgzy: [{ required: false, message: "请选择职教类别", trigger: "blur" }],
  // 预科直升
  ykzslb: [{ required: false, message: "请选择预科直升", trigger: "blur" }],
  // 兼报中专
  jbzz: [{ required: false, message: "请选择兼报中专", trigger: "blur" }],
  // 体育单招
  tydz: [{ required: false, message: "请选择体育单招", trigger: "blur" }],
  // 成绩证书
  cjzs: [{ required: false, message: "请选择成绩证书", trigger: "blur" }],
  // 填报标记
  kstbbj: [{ required: false, message: "请选择填报标记", trigger: "blur" }],
  // 班级
  bjxx: [
    { required: false, message: "请输入班级信息", trigger: "blur" },
    { max: 2, message: "班级信息不超过2位", trigger: "blur" },
  ],
  // 选考专项
  xkzx: [{ required: false, message: "请选择选考专项", trigger: "blur" }],
  // 美术考点
  mskd: [{ required: false, message: "请选择美术考点", trigger: "blur" }],
  // 考号
  kh: [
    { required: false, message: "请输入考号", trigger: "blur" },
    { max: 9, message: "考号不超过9位", trigger: "blur" },
  ],
  // 邮编
  yzbm: [
    { required: false, message: "请输入邮编", trigger: "blur" },
    { max: 6, message: "邮编不超过6位", trigger: "blur" },
  ],
  // 邮寄地址
  yjdz: [
    { required: false, message: "请输入邮寄地址", trigger: "blur" },
    { max: 54, message: "邮寄地址不超过54位", trigger: "blur" },
  ],
  // 专业考试类别
  yskslb: [{ required: false, message: "请选择专业考试类别", trigger: "blur" }],
  // 加试科目
  jskm: [{ required: false, message: "请选择加试科目", trigger: "blur" }],
  // 考生特征
  kstz: [{ required: false, message: "请选择考生特征", trigger: "blur" }],
  // 联系电话
  lxdh: [
    { required: false, validator: validatePhoneNumber, trigger: "blur" },
    { max: 16, message: "联系电话不超过16位", trigger: "blur" },
  ],
  // 固定电话
  gddh: [
    { required: false, validator: validatezjNumber, trigger: "blur" },
    { max: 16, message: "固定电话不超过16位", trigger: "blur" },
  ],

  // 移动电话
  yddh: [
    { required: false, validator: validatePhoneNumber, trigger: "blur" },
    { max: 16, message: "移动电话不超过16位", trigger: "blur" },
  ],
  // 电话优先标识
  dhyxbs: [{ required: false, message: "请选择电话优先标识", trigger: "blur" }],
  // 简历1起始日期
  qsrq1: [{ required: false, message: "请选择简历1起始日期", trigger: "blur" }],
  // 简历1终结日期
  zjrq1: [{ required: false, message: "请选择简历1终结日期", trigger: "blur" }],
  // 简历1证明人
  zmr1: [
    { required: false, message: "请输入简历1证明人", trigger: "blur" },
    { max: 8, message: "证明人不超过8个字符", trigger: "blur" },
  ],
  // 简历1任何职务
  rhzw1: [
    { required: false, message: "请输入简历1任何职务", trigger: "blur" },
    { max: 12, message: "职务不超过12个字符", trigger: "blur" },
  ],
  // 简历1内容
  jl1: [
    { required: false, message: "请输入简历1内容", trigger: "blur" },
    { max: 40, message: "简历内容不超过40个字符", trigger: "blur" },
  ],

  // 简历2起始日期
  qsrq2: [{ required: false, message: "请选择简历2起始日期", trigger: "blur" }],
  // 简历2终结日期
  zjrq2: [{ required: false, message: "请选择简历2终结日期", trigger: "blur" }],
  // 简历2证明人
  zmr2: [
    { required: false, message: "请输入简历2证明人", trigger: "blur" },
    { max: 8, message: "证明人不超过8个字符", trigger: "blur" },
  ],
  // 简历2任何职务
  rhzw2: [
    { required: false, message: "请输入简历2任何职务", trigger: "blur" },
    { max: 12, message: "职务不超过12个字符", trigger: "blur" },
  ],
  // 简历2内容
  jl2: [
    { required: false, message: "请输入简历2内容", trigger: "blur" },
    { max: 40, message: "简历内容不超过40个字符", trigger: "blur" },
  ],

  // 简历3起始日期
  qsrq3: [{ required: false, message: "请选择简历3起始日期", trigger: "blur" }],
  // 简历3终结日期
  zjrq3: [{ required: false, message: "请选择简历3终结日期", trigger: "blur" }],
  // 简历3证明人
  zmr3: [
    { required: false, message: "请输入简历3证明人", trigger: "blur" },
    { max: 8, message: "证明人不超过8个字符", trigger: "blur" },
  ],
  // 简历3任何职务
  rhzw3: [
    { required: false, message: "请输入简历3任何职务", trigger: "blur" },
    { max: 12, message: "职务不超过12个字符", trigger: "blur" },
  ],
  // 简历3内容
  jl3: [
    { required: false, message: "请输入简历3内容", trigger: "blur" },
    { max: 40, message: "简历内容不超过40个字符", trigger: "blur" },
  ],

  // 考生特长
  kstc: [
    { required: false, message: "请输入考生特长", trigger: "blur" },
    { max: 64, message: "考生特长不超过64个字符", trigger: "blur" },
  ],
  // 奖励和处分
  ksjlhcf: [
    { required: false, message: "请输入奖励和处分", trigger: "blur" },
    { max: 64, message: "奖励和处分不超过64个字符", trigger: "blur" },
  ],
  // 考籍号
  kjh: [
    { required: false, message: "请输入考籍号", trigger: "blur" },
    { max: 12, message: "考籍号不超过12位", trigger: "blur" },
  ],
  // 学籍号
  xjh: [
    { required: false, message: "请输入学籍号", trigger: "blur" },
    { max: 20, message: "学籍号不超过20位", trigger: "blur" },
  ],
  // 政考结论
  zkjl: [
    { required: false, message: "请输入政考结论", trigger: "blur" },
    { max: 16, message: "政考结论不超过16个字符", trigger: "blur" },
  ],

  // 语文
  xyyw: [{ required: false, message: "请选择语文", trigger: "blur" }],
  // 数学
  xysx: [{ required: false, message: "请选择数学", trigger: "blur" }],
  // 外语
  xywy: [{ required: false, message: "请选择外语", trigger: "blur" }],
  // 信息技术
  xyxx: [{ required: false, message: "请选择信息技术", trigger: "blur" }],
  // 思想政治
  xyzz: [{ required: false, message: "请选择思想政治", trigger: "blur" }],
  // 历史
  xyls: [{ required: false, message: "请选择历史", trigger: "blur" }],
  // 地理
  xydl: [{ required: false, message: "请选择地理", trigger: "blur" }],
  // 通用技术
  xyty: [{ required: false, message: "请选择通用技术", trigger: "blur" }],
  // 物理
  xywl: [{ required: false, message: "请选择物理", trigger: "blur" }],
  // 化学
  xyhx: [{ required: false, message: "请选择化学", trigger: "blur" }],

  // 生物
  xysw: [{ required: false, message: "请选择生物", trigger: "blur" }],
  // 道德品质
  szddpz: [{ required: false, message: "请选择道德品质", trigger: "blur" }],
  // 公民素养
  szgmsy: [{ required: false, message: "请选择公民素养", trigger: "blur" }],
  // 交流与合作
  szjlhz: [{ required: false, message: "请选择交流与合作", trigger: "blur" }],
  // 学习能力
  szxxnl: [{ required: false, message: "请选择学习能力", trigger: "blur" }],
  // 运动与健康
  szydjk: [{ required: false, message: "请选择运动与健康", trigger: "blur" }],
  // 审美与表现
  szsmbx: [{ required: false, message: "请选择审美与表现", trigger: "blur" }],
  // 评语标记
  pybj: [{ required: false, message: "请选择评语标记", trigger: "blur" }],
  // 考生标记
  ksbj: [{ required: false, message: "请选择考生标记", trigger: "blur" }],
  // 考生评语
  zsyj: [
    { required: false, message: "请输入考生评语", trigger: "blur" },
    { max: 254, message: "考生评语不超过254个字符", trigger: "blur" },
  ],
};

export default rules