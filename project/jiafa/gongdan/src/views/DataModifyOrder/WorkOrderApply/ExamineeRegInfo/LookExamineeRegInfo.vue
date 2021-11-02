<template>
  <div class="examinee-reg-info">
    <a-modal
      class="examinee-reg-info-modal"
      v-model="visible"
      :title="title"
      @ok="handleOk"
      :width="modalWidth"
      :footer="null"
    >
      <a-form-model
        v-show="wating"
        class="form-model"
        ref="ruleForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :layout="formLayout"
        :selfUpdate="true"
        style="display: flex;flex-wrap: wrap;"
      >
        <!-- 报名号 -->
        <a-form-model-item ref="bmh" label="报名号" prop="bmh">
          <a-input
            size="small"
            :disabled="listDisabled"
            v-model.trim="form.bmh"
            hasFeedback
            placeholder="请输入报名号"
          />
        </a-form-model-item>
        <!-- 姓名 -->
        <a-form-model-item ref="xm" label="姓名" prop="xm">
          <a-input size="small" :disabled="listDisabled" v-model="form.xm" placeholder="请输入姓名" />
        </a-form-model-item>
        <!-- 报名序号 -->
        <a-form-model-item ref="bmxh" label="报名序号" prop="bmxh">
          <a-input size="small" :disabled="listDisabled" v-model="form.bmxh" placeholder="请输入报名序号" />
        </a-form-model-item>
        <!-- 区县代码 -->
        <a-form-model-item ref="xqdh" label="区县代码" prop="xqdh">
          <a-input size="small" :disabled="listDisabled" v-model="form.xqdh" placeholder="请输入区县代码" />
        </a-form-model-item>
        <!-- 身份证号码 -->
        <a-form-model-item ref="sfzh" label="身份证号码" prop="sfzh">
          <a-input
            size="small"
            :disabled="listDisabled"
            v-model="form.sfzh"
            placeholder="请输入身份证号码"
          />
        </a-form-model-item>
        <!-- 性别 -->
        <a-form-model-item ref="xbdm" label="性别" prop="xbdm">
          <a-select size="small" :disabled="listDisabled" v-model="form.xbdm" placeholder="请选择性别">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xb"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 出生日期 -->
        <a-form-model-item ref="csrq" label="出生日期" prop="csrq">
          <a-date-picker
            size="small"
            :disabled="listDisabled"
            v-model="form.csrq"
            format="YYYY-MM-DD"
            :showToday="false"
            :allowClear="false"
            type="date"
            placeholder="请选择出生日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <!-- 民族 -->
        <a-form-model-item ref="mzdm" label="民族" prop="mzdm">
          <a-select size="small" :disabled="listDisabled" v-model="form.mzdm" placeholder="请选择民族">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.mz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考试类型 -->
        <a-form-model-item ref="kslxdm" label="考试类型" prop="kslxdm">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.kslxdm"
            placeholder="请选择考试类型"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.kslxdm"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 科类 -->
        <a-form-model-item ref="kldm" label="科类" prop="kldm">
          <a-select size="small" :disabled="listDisabled" v-model="form.kldm" placeholder="请选择科类">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.kldm"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- ******************************************************** -->

        <!-- 户籍地址 -->
        <a-form-model-item ref="hjdz" label="户籍地址" prop="hjdz" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model.lazy="form.hjdz" placeholder="请输入户籍地址" />
        </a-form-model-item>
        <!-- 户籍性质 -->
        <a-form-model-item ref="hjxzdm" label="户籍性质" prop="hjxzdm">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.hjxzdm"
            placeholder="请选择户籍性质"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.hjxzdm"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 应往届 -->
        <a-form-model-item ref="ywjdm" label="应往届" prop="ywjdm">
          <a-select size="small" :disabled="listDisabled" v-model="form.ywjdm" placeholder="请选择应往届">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.ywjdm"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考生类别 -->
        <a-form-model-item ref="kslbdm" label="考生类别" prop="kslbdm">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.kslbdm"
            placeholder="请选择考生类别"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.kslbdm"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 政治面貌 -->
        <a-form-model-item ref="zzmmdm" label="政治面貌" prop="zzmmdm">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.zzmmdm"
            placeholder="请选择政治面貌"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.zzmmdm"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 报名点 -->
        <a-form-model-item ref="bmddm" label="报名点" prop="bmddm">
          <a-input size="small" :disabled="listDisabled" v-model="form.bmddm" placeholder="请输入报名点" />
        </a-form-model-item>
        <!-- 毕业类别 -->
        <a-form-model-item ref="bylbdm" label="毕业类别" prop="bylbdm">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.bylbdm"
            placeholder="请选择毕业类别"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.bylbdm"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 毕业学校代码 -->
        <a-form-model-item ref="byxx" label="毕业学校代码" prop="byxx">
          <a-input
            size="small"
            :disabled="listDisabled"
            v-model="form.byxx"
            placeholder="请输入毕业学校代码"
          />
        </a-form-model-item>
        <!-- 毕业学校名称 -->
        <a-form-model-item ref="byxxmc" label="毕业学校名称" prop="byxxmc">
          <a-input
            size="small"
            :disabled="listDisabled"
            v-model="form.byxxmc"
            placeholder="请输入毕业学校名称"
          />
        </a-form-model-item>
        <!-- 应试外语 -->
        <a-form-model-item ref="yswy" label="应试外语" prop="yswy">
          <a-select size="small" :disabled="listDisabled" v-model="form.yswy" placeholder="请选择应试外语">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.yswy"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 职教类别 -->
        <a-form-model-item ref="zgzy" label="职教类别" prop="zgzy">
          <a-select size="small" :disabled="listDisabled" v-model="form.zgzy" placeholder="请选择职教类别">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.zgzy"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 预科直升 -->
        <a-form-model-item ref="ykzslb" label="预科直升" prop="ykzslb">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.ykzslb"
            placeholder="请选择预科直升"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.ykzslb"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 兼报中专 -->
        <a-form-model-item ref="jbzz" label="兼报中专" prop="jbzz">
          <a-select size="small" :disabled="listDisabled" v-model="form.jbzz" placeholder="请选择兼报中专">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.jbzz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 体育单招 -->
        <a-form-model-item ref="tydz" label="体育单招" prop="tydz">
          <a-select size="small" :disabled="listDisabled" v-model="form.tydz" placeholder="请选择体育单招">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.tydz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 成绩证书 -->
        <a-form-model-item ref="cjzs" label="成绩证书" prop="cjzs">
          <a-select size="small" :disabled="listDisabled" v-model="form.cjzs" placeholder="请选择成绩证书">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.cjzs"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 填报标记 -->
        <a-form-model-item ref="kstbbj" label="填报标记" prop="kstbbj">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.kstbbj"
            placeholder="请选择填报标记"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.kstbbj"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 班级 -->
        <a-form-model-item ref="bjxx" label="班级" prop="bjxx">
          <a-input size="small" :disabled="listDisabled" v-model="form.bjxx" placeholder="请输入班级" />
        </a-form-model-item>
        <!-- 体育选考 -->
        <a-form-model-item ref="xkzx" label="体育选考" prop="xkzx">
          <a-select size="small" :disabled="listDisabled" v-model="form.xkzx" placeholder="请选择选考专项">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xkzx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 美术考点 -->
        <a-form-model-item ref="mskd" label="美术考点" prop="mskd">
          <a-select size="small" :disabled="listDisabled" v-model="form.mskd" placeholder="请选择美术考点">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.mskd"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考号 -->
        <a-form-model-item ref="kh" label="考号" prop="kh">
          <a-input size="small" :disabled="listDisabled" v-model="form.kh" placeholder="请输入考号" />
        </a-form-model-item>
        <!-- 邮编 -->
        <a-form-model-item ref="yzbm" label="邮编" prop="yzbm">
          <a-input size="small" :disabled="listDisabled" v-model="form.yzbm" placeholder="请输入邮编" />
        </a-form-model-item>
        <!-- 邮寄地址 -->
        <a-form-model-item ref="yjdz" label="邮寄地址" prop="yjdz" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model="form.yjdz" placeholder="请输入邮寄地址" />
        </a-form-model-item>
        <!-- ******************************************************************************* -->

        <!-- 专业考试类别 -->
        <a-form-model-item
          label="专业考试类别"
          prop="yskslb"
          :label-col="{ span:2}"
          :wrapper-col="{ span: 22}"
          class="form-item-group"
        >
          <a-checkbox-group :disabled="listDisabled" v-model="form.yskslb">
            <a-checkbox
              :value="item.value"
              name="type"
              v-for="(item,index) in examineeRegInfoCode.yskslb"
              :key="index"
            >{{item.name}}</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 加试科目 -->
        <a-form-model-item
          label="加试科目"
          prop="jskm"
          :label-col="{ span:2}"
          :wrapper-col="{ span: 22}"
          class="form-item-group"
        >
          <a-checkbox-group :disabled="listDisabled" v-model="form.jskm">
            <a-checkbox
              :value="item.value"
              name="type"
              v-for="(item,index) in examineeRegInfoCode.jskm"
              :key="index"
            >{{item.name}}</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- 考生特征 -->
        <a-form-model-item
          label="考生特征"
          prop="kstz"
          :label-col="{ span:2}"
          :wrapper-col="{ span: 22}"
          class="form-item-group"
        >
          <a-checkbox-group :disabled="listDisabled" v-model="form.kstz">
            <a-checkbox
              :value="item.value"
              name="type"
              v-for="(item,index) in examineeRegInfoCode.kstz"
              :key="index"
            >{{item.name}}</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <!-- ******************************************************************************* -->

        <!-- 联系电话 -->
        <a-form-model-item ref="lxdh" label="联系电话" prop="lxdh">
          <a-input size="small" :disabled="listDisabled" v-model="form.lxdh" placeholder="请输入联系电话" />
        </a-form-model-item>
        <!-- 固定电话 -->
        <a-form-model-item ref="gddh" label="固定电话" prop="gddh">
          <a-input size="small" :disabled="listDisabled" v-model="form.gddh" placeholder="请输入固定电话" />
        </a-form-model-item>
        <!-- 移动电话 -->
        <a-form-model-item ref="yddh" label="移动电话" prop="yddh">
          <a-input size="small" :disabled="listDisabled" v-model="form.yddh" placeholder="请输入移动电话" />
        </a-form-model-item>
        <!-- 电话优先标识 -->
        <a-form-model-item ref="dhyxbs" label="电话优先标识" prop="dhyxbs">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.dhyxbs"
            placeholder="请选择电话优先标识"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.dhyxbs"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 简历1起始日期 -->
        <a-form-model-item ref="qsrq1" label="简历1起始日期" prop="qsrq1">
          <!-- <a-inpu size="small" :disabled="listDisabled" v-model="form.name"/> -->
          <a-month-picker
            size="small"
            :disabled="listDisabled"
            v-model="form.qsrq1"
            format="YYYY-MM"
            :showToday="false"
            :allowClear="false"
            type="date"
            placeholder="请选择简历1起始日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <!-- 简历1终结日期 -->
        <a-form-model-item ref="zjrq1" label="简历1终结日期" prop="zjrq1">
          <a-month-picker
            size="small"
            :disabled="listDisabled"
            v-model="form.zjrq1"
            format="YYYY-MM"
            :showToday="false"
            :allowClear="false"
            type="date"
            placeholder="请选择简历1终结日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <!-- 简历1证明人 -->
        <a-form-model-item ref="zmr1" label="简历1证明人" prop="zmr1">
          <a-input size="small" :disabled="listDisabled" v-model="form.zmr1" placeholder="请输入证明人" />
        </a-form-model-item>
        <!-- 简历1任何职务 -->
        <a-form-model-item ref="rhzw1" label="简历1任何职务" prop="rhzw1">
          <a-input
            size="small"
            :disabled="listDisabled"
            v-model="form.rhzw1"
            placeholder="请输入任何职务"
          />
        </a-form-model-item>
        <!-- 简历1内容 -->
        <a-form-model-item ref="jl1" label="简历1内容" prop="jl1" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model="form.jl1" placeholder="请输入简历1内容" />
        </a-form-model-item>

        <!-- 简历2起始日期 -->
        <a-form-model-item ref="qsrq2" label="简历2起始日期" prop="qsrq2">
          <a-month-picker
            size="small"
            :disabled="listDisabled"
            v-model="form.qsrq2"
            format="YYYY-MM"
            :showToday="false"
            :allowClear="false"
            type="date"
            placeholder="请选择简历2起始日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <!-- 简历2终结日期 -->
        <a-form-model-item ref="zjrq2" label="简历2终结日期" prop="zjrq2">
          <a-month-picker
            size="small"
            :disabled="listDisabled"
            v-model="form.zjrq2"
            format="YYYY-MM"
            :showToday="false"
            :allowClear="false"
            type="date"
            placeholder="请选择简历2终结日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <!-- 简历2证明人 -->
        <a-form-model-item ref="zmr2" label="简历2证明人" prop="zmr2">
          <a-input size="small" :disabled="listDisabled" v-model="form.zmr2" placeholder="请输入证明人" />
        </a-form-model-item>
        <!-- 简历2任何职务 -->
        <a-form-model-item ref="rhzw2" label="简历2任何职务" prop="rhzw2">
          <a-input
            size="small"
            :disabled="listDisabled"
            v-model="form.rhzw2"
            placeholder="请输入任何职务"
          />
        </a-form-model-item>
        <!-- 简历2内容 -->
        <a-form-model-item ref="jl2" label="简历2内容" prop="jl2" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model="form.jl2" placeholder="请输入简历2内容" />
        </a-form-model-item>

        <!-- 简历3起始日期 -->
        <a-form-model-item ref="qsrq3" label="简历3起始日期" prop="qsrq3">
          <a-month-picker
            size="small"
            :disabled="listDisabled"
            v-model="form.qsrq3"
            format="YYYY-MM"
            :showToday="false"
            :allowClear="false"
            type="date"
            placeholder="请选择简历3起始日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <!-- 简历3终结日期 -->
        <a-form-model-item ref="zjrq3" label="简历3终结日期" prop="zjrq3">
          <a-month-picker
            size="small"
            :disabled="listDisabled"
            v-model="form.zjrq3"
            format="YYYY-MM"
            :showToday="false"
            :allowClear="false"
            type="date"
            placeholder="请选择简历3终结日期"
            style="width: 100%;"
          />
        </a-form-model-item>
        <!-- 简历3证明人 -->
        <a-form-model-item ref="zmr3" label="简历3证明人" prop="zmr3">
          <a-input size="small" :disabled="listDisabled" v-model="form.zmr3" placeholder="请输入证明人" />
        </a-form-model-item>
        <!-- 简历3任何职务 -->
        <a-form-model-item ref="rhzw3" label="简历3任何职务" prop="rhzw3">
          <a-input
            size="small"
            :disabled="listDisabled"
            v-model="form.rhzw3"
            placeholder="请输入任何职务"
          />
        </a-form-model-item>
        <!-- 简历3内容 -->
        <a-form-model-item ref="jl3" label="简历3内容" prop="jl3" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model="form.jl3" placeholder="请输入简历3内容" />
        </a-form-model-item>

        <!-- 考生特长 -->
        <a-form-model-item ref="kstc" label="考生特长" prop="kstc" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model="form.kstc" placeholder="请输入考生特长" />
        </a-form-model-item>
        <!-- 奖励和处分 -->
        <a-form-model-item ref="ksjlhcf" label="奖励和处分" prop="ksjlhcf" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model="form.ksjlhcf" placeholder="请输入奖励和处分" />
        </a-form-model-item>

        <!-- ******************************************************************************* -->

        <!-- 考籍号 -->
        <a-form-model-item ref="kjh" label="考籍号" prop="kjh">
          <a-input size="small" :disabled="listDisabled" v-model="form.kjh" placeholder="请输入考籍号" />
        </a-form-model-item>
        <!-- 学籍号 -->
        <a-form-model-item ref="xjh" label="学籍号" prop="xjh">
          <a-input size="small" :disabled="listDisabled" v-model="form.xjh" placeholder="请输入学籍号" />
        </a-form-model-item>
        <!-- 政考结论 -->
        <a-form-model-item ref="zkjl" label="政考结论" prop="zkjl">
          <a-input size="small" :disabled="listDisabled" v-model="form.zkjl" placeholder="请输入政考结论" />
        </a-form-model-item>
        <!-- 语文 -->
        <a-form-model-item ref="xyyw" label="语文" prop="xyyw">
          <a-select size="small" :disabled="listDisabled" v-model="form.xyyw" placeholder="请选择语文">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyyw"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 数学 -->
        <a-form-model-item ref="xysx" label="数学" prop="xysx">
          <a-select size="small" :disabled="listDisabled" v-model="form.xysx" placeholder="请选择数学">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xysx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 外语 -->
        <a-form-model-item ref="xywy" label="外语" prop="xywy">
          <a-select size="small" :disabled="listDisabled" v-model="form.xywy" placeholder="请选择外语">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xywy"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 信息技术 -->
        <a-form-model-item ref="xyxx" label="信息技术" prop="xyxx">
          <a-select size="small" :disabled="listDisabled" v-model="form.xyxx" placeholder="请选择信息技术">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyxx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 思想政治 -->
        <a-form-model-item ref="xyzz" label="思想政治" prop="xyzz">
          <a-select size="small" :disabled="listDisabled" v-model="form.xyzz" placeholder="请选择思想政治">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyzz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 历史 -->
        <a-form-model-item ref="xyls" label="历史" prop="xyls">
          <a-select size="small" :disabled="listDisabled" v-model="form.xyls" placeholder="请选择历史">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyls"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 地理 -->
        <a-form-model-item ref="xydl" label="地理" prop="xydl">
          <a-select size="small" :disabled="listDisabled" v-model="form.xydl" placeholder="请选择地理">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xydl"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 通用技术 -->
        <a-form-model-item ref="xyty" label="通用技术" prop="xyty">
          <a-select size="small" :disabled="listDisabled" v-model="form.xyty" placeholder="请选择通用技术">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyty"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 物理 -->
        <a-form-model-item ref="xywl" label="物理" prop="xywl">
          <a-select size="small" :disabled="listDisabled" v-model="form.xywl" placeholder="请选择物理">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xywl"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 化学 -->
        <a-form-model-item ref="xyhx" label="化学" prop="xyhx">
          <a-select size="small" :disabled="listDisabled" v-model="form.xyhx" placeholder="请选择化学">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyhx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 生物 -->
        <a-form-model-item ref="xysw" label="生物" prop="xysw">
          <a-select size="small" :disabled="listDisabled" v-model="form.xysw" placeholder="请选择生物">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xysw"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 道德品质 -->
        <a-form-model-item ref="szddpz" label="道德品质" prop="szddpz">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.szddpz"
            placeholder="请选择道德品质"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.szddpz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 公民素养 -->
        <a-form-model-item ref="szgmsy" label="公民素养" prop="szgmsy">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.szgmsy"
            placeholder="请选择公民素养"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.szgmsy"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 交流与合作 -->
        <a-form-model-item ref="szjlhz" label="交流与合作" prop="szjlhz">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.szjlhz"
            placeholder="请选择交流与合作"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.szjlhz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 学习能力 -->
        <a-form-model-item ref="szxxnl" label="学习能力" prop="szxxnl">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.szxxnl"
            placeholder="请选择学习能力"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.szxxnl"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 运动与健康 -->
        <a-form-model-item ref="szydjk" label="运动与健康" prop="szydjk">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.szydjk"
            placeholder="请选择运动与健康"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.szydjk"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 审美与表现 -->
        <a-form-model-item ref="szsmbx" label="审美与表现" prop="szsmbx">
          <a-select
            size="small"
            :disabled="listDisabled"
            v-model="form.szsmbx"
            placeholder="请选择审美与表现"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.szsmbx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 评语标记 -->
        <a-form-model-item ref="pybj" label="评语标记" prop="pybj">
          <a-select size="small" :disabled="listDisabled" v-model="form.pybj" placeholder="请选择评语标记">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.pybj"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考生标记 -->
        <a-form-model-item ref="ksbj" label="考生标记" prop="ksbj">
          <a-select size="small" :disabled="listDisabled" v-model="form.ksbj" placeholder="请选择考生标记">
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.ksbj"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考生评语 -->
        <a-form-model-item ref="zsyj" label="考生评语" prop="zsyj" class="long-form-model-item">
          <a-textarea :disabled="listDisabled" v-model="form.zsyj" placeholder="请输入考生评语" />
        </a-form-model-item>
      </a-form-model>
      <a-skeleton :paragraph="{ rows: 20 }" :loading="loading" />
    </a-modal>
  </div>
</template>
 
<script>
/**
 * @description 报名信息修改表查看
 * @date 2021-1-26 11:40:15
 */

import form from "./com/form";
// import options from './com/options'
// console.log(options);
export default {
  name: "ExamineeRegInfo",
  components: {},
  data() {
    return {
      // formLayout:"inline",
      formLayout: "horizontal",
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      type: "", // 页面类型（编辑 / 查看）
      wkId: "", // 该生所属工单
      bmh: "", // 该生报名号
      listDisabled: true,
      wating: false,
      loading: true,
      form,
      examineeRegInfoCode: {}, // 码表
      regInfo: null,
      alterInfo: [],
      status: false,
      visible: false
    };
  },
  created() {
    // 路由传参
    // this.status = this.$route.query.status;
    /**
     * @description 如果路由跳转有这个status（为true）表示从工单审核页面进入,否则需要的信息从session取
     */
    // if(this.status){
    //   this.wkId = this.$route.query.wkId;
    //   this.bmh = this.$route.query.bmh;
    //   this.type = this.$route.query.type;
    // }
  },
  mounted() {},
  computed: {
    title() {
      return `报名信息查看-报名号：${this.bmh}`;
    },
    modalWidth() {
      return `${window.screen.width * 0.8}px`;
    }
  },
  methods: {
    showModal(data) {
      this.wkId = data.wkId;
      this.bmh = data.bmh;
      this.type = data.type;

      this.visible = true;
      this.getExamineeRegInfoCode();
      this.getExamineeRegInfo();
      // 占位符效果
      setTimeout(() => {
        this.loading = false;
        this.wating = true;
      }, 0);
    },

    handleOk() {
      this.visible = false;
    },
    // 返回
    goBack() {
      this.$router.go(-1);
      if (sessionStorage.getItem("wkPageType") !== "look") {
        sessionStorage.setItem("examineePageType", "edit");
      }
    },
    // 获取考生信息表
    async getExamineeRegInfo() {
      const { wkId, bmh } = this;
      try {
        const res = await this.$api.WorkOrderApply.getExamineeRegInfo({
          wkId,
          bmh
        });
        if (res.code === "200") {
          this.form = res.data.regInfo;

          // 此处：后端返回值为string，而多选框为数组，需要转为数组
          if (!this.form.yskslb) {
            this.form.yskslb = [];
          } else {
            this.form.yskslb = this.form.yskslb.split(",");
          }

          if (!this.form.jskm) {
            this.form.jskm = [];
          } else {
            this.form.jskm = this.form.jskm.split(",");
          }

          if (!this.form.kstz) {
            this.form.kstz = [];
          } else {
            this.form.kstz = this.form.kstz.split(",");
          }
        } else {
          this.$message.error("获取数据失败！" + res.message);
        }
      } catch (error) {}
    },
    // 获取考生信息表所有码表
    async getExamineeRegInfoCode() {
      try {
        const res = await this.$api.WorkOrderApply.getExamineeRegInfoCode({});
        if (res.code === "200") {
          this.examineeRegInfoCode = res.data;
        }
      } catch (error) {}
    }
  }
};
</script>
 
<style lang="less">
.examinee-reg-info {
  padding: 20px;
  background: #fff;
}
.examinee-reg-info-modal {
  // 2/24 文坛增加
  .ant-modal-body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    height: 70vh;
    overflow-y: scroll;
  }
  // 2/24 文坛添加
  .ant-input[disabled] {
    color: rgba(0, 0, 0, 0.85);
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 1;
  }
  .ant-select-disabled .ant-select-selection {
    background: #f5f5f5;
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.85);
  }
  .ant-checkbox-disabled + span {
    color: rgba(0, 0, 0, 0.85);
    cursor: not-allowed;
  }
  // 长输入框
  .long-form-model-item {
    width: 1360px !important;
    & > .ant-col-8 {
      // width: 110px;
      width: 8%;
    }
    & > .ant-col-16 {
      // width: 1250px;
      width: 92%;
    }
  }
  // 单选组
  .form-item-group {
    width: 100% !important;
  }
  .ant-form-item-with-help {
    margin-bottom: 0;
  }
  .ant-form-item {
    margin-right: 0;
    // margin-bottom: 22px;
    width: 340px;
  }
  .ant-form lable {
    font-size: 12px !important;
  }
}
</style>