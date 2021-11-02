<template>
  <div class="examinee-reg-info">
    <header>
      <h3 class="title">报名信息{{type === "look" ? "查看" : type === "edit" ? "修改" : ""}}-报名号：{{ bmh }}</h3>
      <a-button @click="goBack">
        <svg-icon icon-class="返回" :scale="0.8" style="margin-right: 5px" />返回
      </a-button>
    </header>

    <main>
      <a-form-model
        v-show="wating"
        class="form-model"
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :layout="formLayout"
        :selfUpdate="true"
        style="display: flex;flex-wrap: wrap;"
      >
        <!-- 报名号 -->
        <a-form-model-item ref="bmh" label="报名号" prop="bmh">
          <a-input
            :class="getDifferentClassName('bmh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model.trim="form.bmh"
            hasFeedback
            placeholder="请输入报名号"
          />
        </a-form-model-item>
        <!-- 姓名 -->
        <a-form-model-item ref="xm" label="姓名" prop="xm">
          <a-input
            :class="getDifferentClassName('xm') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xm"
            placeholder="请输入姓名"
          />
        </a-form-model-item>
        <!-- 报名序号 -->
        <a-form-model-item ref="bmxh" label="报名序号" prop="bmxh">
          <a-input
            :class="getDifferentClassName('bmxh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.bmxh"
            placeholder="请输入报名序号"
          />
        </a-form-model-item>
        <!-- 区县代码 -->
        <a-form-model-item ref="xqdh" label="区县代码" prop="xqdh">
          <a-input
            :class="getDifferentClassName('xqdh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xqdh"
            placeholder="请输入区县代码"
          />
        </a-form-model-item>
        <!-- 身份证号码 -->
        <a-form-model-item ref="sfzh" label="身份证号码" prop="sfzh">
          <a-input
            :class="getDifferentClassName('sfzh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.sfzh"
            placeholder="请输入身份证号码"
            @change="sfzhChange"
          />
        </a-form-model-item>
        <!-- 性别 -->
        <a-form-model-item ref="xbdm" label="性别" prop="xbdm">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xbdm') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xbdm"
            placeholder="请选择性别"
          >
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
            :getCalendarContainer="(trigger)=>{ return trigger.parentNode || document.body; }"
            :class="getDifferentClassName('csrq') ? 'updatedClass' : '' "
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
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('mzdm') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.mzdm"
            placeholder="请选择民族"
          >
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('kslxdm') ? 'updatedClass' : '' "
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
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('kldm') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.kldm"
            placeholder="请选择科类"
          >
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
          <a-textarea
            :class="getDifferentClassName('hjdz') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model.lazy="form.hjdz"
            placeholder="请输入户籍地址"
          />
        </a-form-model-item>
        <!-- 户籍性质 -->
        <a-form-model-item ref="hjxzdm" label="户籍性质" prop="hjxzdm">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('hjxzdm') ? 'updatedClass' : '' "
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
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('ywjdm') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.ywjdm"
            placeholder="请选择应往届"
          >
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('kslbdm') ? 'updatedClass' : '' "
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('zzmmdm') ? 'updatedClass' : '' "
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
          <a-input
            :class="getDifferentClassName('bmddm') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.bmddm"
            placeholder="请输入报名点"
          />
        </a-form-model-item>
        <!-- 毕业类别 -->
        <a-form-model-item ref="bylbdm" label="毕业类别" prop="bylbdm">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('bylbdm') ? 'updatedClass' : '' "
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
            :class="getDifferentClassName('byxx') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.byxx"
            placeholder="请输入毕业学校代码"
          />
        </a-form-model-item>
        <!-- 毕业学校名称 -->
        <a-form-model-item ref="byxxmc" label="毕业学校名称" prop="byxxmc">
          <a-input
            :class="getDifferentClassName('byxxmc') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.byxxmc"
            placeholder="请输入毕业学校名称"
          />
        </a-form-model-item>
        <!-- 应试外语 -->
        <a-form-model-item ref="yswy" label="应试外语" prop="yswy">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('yswy') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.yswy"
            placeholder="请选择应试外语"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.yswy"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 职教类别 -->
        <a-form-model-item ref="zgzy" label="职教类别" prop="zgzy">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('zgzy') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.zgzy"
            placeholder="请选择职教类别"
          >
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('ykzslb') ? 'updatedClass' : '' "
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
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('jbzz') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.jbzz"
            placeholder="请选择兼报中专"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.jbzz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 体育单招 -->
        <a-form-model-item ref="tydz" label="体育单招" prop="tydz">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('tydz') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.tydz"
            placeholder="请选择体育单招"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.tydz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 成绩证书 -->
        <a-form-model-item ref="cjzs" label="成绩证书" prop="cjzs">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('cjzs') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.cjzs"
            placeholder="请选择成绩证书"
          >
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('kstbbj') ? 'updatedClass' : '' "
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
          <a-input
            :class="getDifferentClassName('bjxx') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.bjxx"
            placeholder="请输入班级"
          />
        </a-form-model-item>
        <!-- 体育选考 -->
        <a-form-model-item ref="xkzx" label="体育选考" prop="xkzx">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xkzx') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xkzx"
            placeholder="请选择选考专项"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xkzx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 美术考点 -->
        <a-form-model-item ref="mskd" label="美术考点" prop="mskd">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('mskd') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.mskd"
            placeholder="请选择美术考点"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.mskd"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考号 -->
        <a-form-model-item ref="kh" label="考号" prop="kh">
          <a-input
            :class="getDifferentClassName('kh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.kh"
            placeholder="请输入考号"
          />
        </a-form-model-item>
        <!-- 邮编 -->
        <a-form-model-item ref="yzbm" label="邮编" prop="yzbm">
          <a-input
            :class="getDifferentClassName('yzbm') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.yzbm"
            placeholder="请输入邮编"
          />
        </a-form-model-item>
        <!-- 邮寄地址 -->
        <a-form-model-item ref="yjdz" label="邮寄地址" prop="yjdz" class="long-form-model-item">
          <a-textarea
            :class="getDifferentClassName('yjdz') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.yjdz"
            placeholder="请输入邮寄地址"
          />
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
          <a-checkbox-group
            :class="getDifferentClassName('yskslb') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.yskslb"
          >
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
          <a-checkbox-group
            :class="getDifferentClassName('jskm') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.jskm"
          >
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
          <a-checkbox-group
            :class="getDifferentClassName('kstz') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.kstz"
          >
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
          <a-input
            :class="getDifferentClassName('lxdh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.lxdh"
            placeholder="请输入联系电话"
          />
        </a-form-model-item>
        <!-- 固定电话 -->
        <a-form-model-item ref="gddh" label="固定电话" prop="gddh">
          <a-input
            :class="getDifferentClassName('gddh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.gddh"
            placeholder="请输入固定电话"
          />
        </a-form-model-item>
        <!-- 移动电话 -->
        <a-form-model-item ref="yddh" label="移动电话" prop="yddh">
          <a-input
            :class="getDifferentClassName('yddh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.yddh"
            placeholder="请输入移动电话"
          />
        </a-form-model-item>
        <!-- 电话优先标识 -->
        <a-form-model-item ref="dhyxbs" label="电话优先标识" prop="dhyxbs">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('dhyxbs') ? 'updatedClass' : '' "
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
          <!-- <a-input :class="getDifferentClassName('xb') ? 'updatedClass' : '' " size="small" :disabled="listDisabled" v-model="form.name"/> -->
          <a-month-picker
            :getCalendarContainer="(trigger)=>{ return trigger.parentNode || document.body; }"
            :class="getDifferentClassName('qsrq1') ? 'updatedClass' : '' "
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
            :getCalendarContainer="(trigger)=>{ return trigger.parentNode || document.body; }"
            :class="getDifferentClassName('zjrq1') ? 'updatedClass' : '' "
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
          <a-input
            :class="getDifferentClassName('zmr1') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.zmr1"
            placeholder="请输入证明人"
          />
        </a-form-model-item>
        <!-- 简历1任何职务 -->
        <a-form-model-item ref="rhzw1" label="简历1任何职务" prop="rhzw1">
          <a-input
            :class="getDifferentClassName('rhzw1') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.rhzw1"
            placeholder="请输入任何职务"
          />
        </a-form-model-item>
        <!-- 简历1内容 -->
        <a-form-model-item ref="jl1" label="简历1内容" prop="jl1" class="long-form-model-item">
          <a-textarea
            :class="getDifferentClassName('jl1') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.jl1"
            placeholder="请输入简历1内容"
          />
        </a-form-model-item>

        <!-- 简历2起始日期 -->
        <a-form-model-item ref="qsrq2" label="简历2起始日期" prop="qsrq2">
          <a-month-picker
            :getCalendarContainer="(trigger)=>{ return trigger.parentNode || document.body; }"
            :class="getDifferentClassName('qsrq2') ? 'updatedClass' : '' "
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
            :getCalendarContainer="(trigger)=>{ return trigger.parentNode || document.body; }"
            :class="getDifferentClassName('zjrq2') ? 'updatedClass' : '' "
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
          <a-input
            :class="getDifferentClassName('zmr2') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.zmr2"
            placeholder="请输入证明人"
          />
        </a-form-model-item>
        <!-- 简历2任何职务 -->
        <a-form-model-item ref="rhzw2" label="简历2任何职务" prop="rhzw2">
          <a-input
            :class="getDifferentClassName('rhzw2') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.rhzw2"
            placeholder="请输入任何职务"
          />
        </a-form-model-item>
        <!-- 简历2内容 -->
        <a-form-model-item ref="jl2" label="简历2内容" prop="jl2" class="long-form-model-item">
          <a-textarea
            :class="getDifferentClassName('jl2') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.jl2"
            placeholder="请输入简历2内容"
          />
        </a-form-model-item>

        <!-- 简历3起始日期 -->
        <a-form-model-item ref="qsrq3" label="简历3起始日期" prop="qsrq3">
          <a-month-picker
            :getCalendarContainer="(trigger)=>{ return trigger.parentNode || document.body; }"
            :class="getDifferentClassName('qsrq3') ? 'updatedClass' : '' "
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
            :getCalendarContainer="(trigger)=>{ return trigger.parentNode || document.body; }"
            :class="getDifferentClassName('zjrq3') ? 'updatedClass' : '' "
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
          <a-input
            :class="getDifferentClassName('zmr3') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.zmr3"
            placeholder="请输入证明人"
          />
        </a-form-model-item>
        <!-- 简历3任何职务 -->
        <a-form-model-item ref="rhzw3" label="简历3任何职务" prop="rhzw3">
          <a-input
            :class="getDifferentClassName('rhzw3') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.rhzw3"
            placeholder="请输入任何职务"
          />
        </a-form-model-item>
        <!-- 简历3内容 -->
        <a-form-model-item ref="jl3" label="简历3内容" prop="jl3" class="long-form-model-item">
          <a-textarea
            :class="getDifferentClassName('jl3') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.jl3"
            placeholder="请输入简历3内容"
          />
        </a-form-model-item>

        <!-- 考生特长 -->
        <a-form-model-item ref="kstc" label="考生特长" prop="kstc" class="long-form-model-item">
          <a-textarea
            :class="getDifferentClassName('kstc') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.kstc"
            placeholder="请输入考生特长"
          />
        </a-form-model-item>
        <!-- 奖励和处分 -->
        <a-form-model-item ref="ksjlhcf" label="奖励和处分" prop="ksjlhcf" class="long-form-model-item">
          <a-textarea
            :class="getDifferentClassName('ksjlhcf') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.ksjlhcf"
            placeholder="请输入奖励和处分"
          />
        </a-form-model-item>

        <!-- ******************************************************************************* -->

        <!-- 考籍号 -->
        <a-form-model-item ref="kjh" label="考籍号" prop="kjh">
          <a-input
            :class="getDifferentClassName('kjh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.kjh"
            placeholder="请输入考籍号"
          />
        </a-form-model-item>
        <!-- 学籍号 -->
        <a-form-model-item ref="xjh" label="学籍号" prop="xjh">
          <a-input
            :class="getDifferentClassName('xjh') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xjh"
            placeholder="请输入学籍号"
          />
        </a-form-model-item>
        <!-- 政考结论 -->
        <a-form-model-item ref="zkjl" label="政考结论" prop="zkjl">
          <a-input
            :class="getDifferentClassName('zkjl') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.zkjl"
            placeholder="请输入政考结论"
          />
        </a-form-model-item>
        <!-- 语文 -->
        <a-form-model-item ref="xyyw" label="语文" prop="xyyw">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xyyw') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xyyw"
            placeholder="请选择语文"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyyw"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 数学 -->
        <a-form-model-item ref="xysx" label="数学" prop="xysx">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xysx') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xysx"
            placeholder="请选择数学"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xysx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 外语 -->
        <a-form-model-item ref="xywy" label="外语" prop="xywy">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xywy') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xywy"
            placeholder="请选择外语"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xywy"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 信息技术 -->
        <a-form-model-item ref="xyxx" label="信息技术" prop="xyxx">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xyxx') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xyxx"
            placeholder="请选择信息技术"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyxx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 思想政治 -->
        <a-form-model-item ref="xyzz" label="思想政治" prop="xyzz">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xyzz') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xyzz"
            placeholder="请选择思想政治"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyzz"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 历史 -->
        <a-form-model-item ref="xyls" label="历史" prop="xyls">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xyls') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xyls"
            placeholder="请选择历史"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyls"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 地理 -->
        <a-form-model-item ref="xydl" label="地理" prop="xydl">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xydl') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xydl"
            placeholder="请选择地理"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xydl"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 通用技术 -->
        <a-form-model-item ref="xyty" label="通用技术" prop="xyty">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xyty') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xyty"
            placeholder="请选择通用技术"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyty"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 物理 -->
        <a-form-model-item ref="xywl" label="物理" prop="xywl">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xywl') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xywl"
            placeholder="请选择物理"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xywl"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 化学 -->
        <a-form-model-item ref="xyhx" label="化学" prop="xyhx">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xyhx') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xyhx"
            placeholder="请选择化学"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.xyhx"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 生物 -->
        <a-form-model-item ref="xysw" label="生物" prop="xysw">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('xysw') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.xysw"
            placeholder="请选择生物"
          >
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('szddpz') ? 'updatedClass' : '' "
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('szgmsy') ? 'updatedClass' : '' "
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('szjlhz') ? 'updatedClass' : '' "
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('szxxnl') ? 'updatedClass' : '' "
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('szydjk') ? 'updatedClass' : '' "
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
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('szsmbx') ? 'updatedClass' : '' "
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
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('pybj') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.pybj"
            placeholder="请选择评语标记"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.pybj"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考生标记 -->
        <a-form-model-item ref="ksbj" label="考生标记" prop="ksbj">
          <a-select
            :getPopupContainer="triggerNode =>{ return triggerNode.parentNode || document.body; }"
            :class="getDifferentClassName('ksbj') ? 'updatedClass' : '' "
            size="small"
            :disabled="listDisabled"
            v-model="form.ksbj"
            placeholder="请选择考生标记"
          >
            <a-select-option
              :value="item.value"
              v-for="(item,index) in examineeRegInfoCode.ksbj"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <!-- 考生评语 -->
        <a-form-model-item ref="zsyj" label="考生评语" prop="zsyj" class="long-form-model-item">
          <a-textarea
            :class="getDifferentClassName('zsyj') ? 'updatedClass' : '' "
            :disabled="listDisabled"
            v-model="form.zsyj"
            placeholder="请输入考生评语"
          />
        </a-form-model-item>
      </a-form-model>
      <a-skeleton :paragraph="{ rows: 20 }" :loading="loading" />
    </main>
    <footer v-if="type==='edit'">
      <a-button v-show="wating" type="primary" class="save-btn" @click="onSubmit">
        <svg-icon icon-class="保存" :scale="0.8" style="margin-right: 5px" />保存
      </a-button>
    </footer>
    <!-- 验证是否身份证号码与性别出生日期统一弹框 -->
    <a-modal
      class="saveModal"
      v-model="saveVisible"
      title="保存变更项"
      @ok="handleOkAlter"
      width="580px"
      @cancel="() => diff = {xbdm:'',csrq:''}"
    >
      <div class="wrap">
        <a-icon type="exclamation-circle" :style="{fontSize:'30px',color:'#FF9933'}" />
        <div class="tips">
          <p>
            系统检测到考生的【身份证号码】
            <span v-if="diff.xbdm">、【性别】</span>
            <span v-if="diff.csrq">、【出生日期】</span>不匹配！
          </p>
          <p>
            将根据当前变更项自动补充考生的
            <span v-if="diff.xbdm">【性别】</span>
            <span v-if="diff.csrq">和【出生日期】</span>变更项，
          </p>
          <p>请确认！</p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
  
<script>
/**
 * @description 报名信息修改表
 * @date 2020-12-14 14:59:54
 * @todo 整个页面表单过多，且都是使用v-model进行双向绑定验证，部分浏览器存在输入卡顿现象
 * @todo 性能优化 （拆分表单），或升级vue3(antdv2)
 */
import moment from "moment";
import rules from "./com/rules";
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
      listDisabled: false,
      wating: false,
      loading: true,
      form,
      rules,
      examineeRegInfoCode: {}, // 码表
      regInfo: null,
      alterInfo: [],
      status: false,
      saveVisible: false,
      diff: {
        xbdm: "",
        csrq: ""
      },
      updateObject: [],
      oldRegInfo: {},
      birthdayAndSex: {}
    };
  },
  created() {
    /**
     * @description 数组扩展方法,删除指定某个元素（根据值删除，不是位置）
     * @param {Array.remove()}
     * @returns {Array}
     */
    Array.prototype.remove = function(val) {
      const index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };

    // 路由传参
    this.status = this.$route.query.status;
    /**
     * @description 如果路由跳转有这个status（为true）表示从工单审核页面进入,否则需要的信息从session取
     */
    if (this.status) {
      this.wkId = this.$route.query.wkId;
      this.bmh = this.$route.query.bmh;
      this.type = this.$route.query.type;
    } else {
      this.wkId = sessionStorage.getItem("id");
      this.bmh = sessionStorage.getItem("bmh");
      this.type = sessionStorage.getItem("regInfoPageType");
    }
  },
  async mounted() {
    await this.getExamineeRegInfoCode();
    await this.getExamineeRegInfo();
    /**
     * @description 如果是查看状态，所有input不可编辑，此处直接在标签加 disable，性能较差
     * @todo 性能优化
     */
    if (this.type === "look") {
      this.listDisabled = true;
    } else {
      this.listDisabled = false;
    }
    // 占位符效果
    setTimeout(() => {
      this.loading = false;
      this.wating = true;
    }, 0);
  },
  beforeDestroy() {
    sessionStorage.removeItem("Osfzh");
    sessionStorage.removeItem("Nsfzh");
  },
  computed: {},
  methods: {
    // 提交
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        console.log(valid);
        if (valid) {
          this.getTheDifferenceItem();
        } else {
          this.$message.warn("请确认输入信息是否合规或是否有必填项未填写！");
          return false;
        }
      });
    },

    // 返回
    goBack() {
      this.$router.go(-1);
      if (sessionStorage.getItem("wkPageType") !== "look") {
        sessionStorage.setItem("examineePageType", "edit");
      }
    },

    /**
     * @description 保存时获取差异项
     * @param {oldRegInfo} 为第一次进入页面请求的整个信息表，存入session；
     * @param {newRegInfo} 为用户修改之后提交时，整个信息表，
     * @param { [changeItem] } 为两次信息表对比后key相同value不同的项，即为本次用户修改过的项
     * @returns {updateItem} 为updatekey[更改项] oldvalue[旧值] newvalue[新值] 组成的对象
     */
    getTheDifferenceItem() {
      const oldRegInfo = JSON.parse(sessionStorage.getItem("regInfo"));
      const newRegInfo = { ...this.form };
      // console.log('oldRegInfo',oldRegInfo);
      // console.log('newRegInfo',newRegInfo);
      // 此处：后端要求传值为string，而多选框为数组，需要转为string
      if (newRegInfo.yskslb) {
        newRegInfo.yskslb = newRegInfo.yskslb.toString();
        if (!newRegInfo.yskslb) {
          newRegInfo.yskslb = null;
        }
      }
      if (newRegInfo.jskm) {
        newRegInfo.jskm = newRegInfo.jskm.toString();
        if (!newRegInfo.jskm) {
          newRegInfo.jskm = null;
        }
      }
      if (newRegInfo.kstz) {
        newRegInfo.kstz = newRegInfo.kstz.toString();
        if (!newRegInfo.kstz) {
          newRegInfo.kstz = null;
        }
      }
      // 对日期进行处理
      if (newRegInfo.csrq) {
        newRegInfo.csrq = moment(newRegInfo.csrq).format("YYYYMMDD");
      }
      if (newRegInfo.qsrq1) {
        newRegInfo.qsrq1 = moment(newRegInfo.qsrq1).format("YYYYMM");
      }
      if (newRegInfo.zjrq1) {
        newRegInfo.zjrq1 = moment(newRegInfo.zjrq1).format("YYYYMM");
      }
      if (newRegInfo.qsrq2) {
        newRegInfo.qsrq2 = moment(newRegInfo.qsrq2).format("YYYYMM");
      }
      if (newRegInfo.zjrq2) {
        newRegInfo.zjrq2 = moment(newRegInfo.zjrq2).format("YYYYMM");
      }
      if (newRegInfo.qsrq3) {
        newRegInfo.qsrq3 = moment(newRegInfo.qsrq3).format("YYYYMM");
      }
      if (newRegInfo.zjrq3) {
        newRegInfo.zjrq3 = moment(newRegInfo.zjrq3).format("YYYYMM");
      }

      // 获得本次 修改过的 项
      const changeItem = this.getObjectSameItem(oldRegInfo, newRegInfo);

      console.log("changeItem", changeItem);
      // 生成本次修改的项 组成数组对象
      const updateObject = [];
      for (const item of changeItem) {
        // oldValue 为修改前的值
        // newValue 为修改后的值
        const oldValue = oldRegInfo[item];
        const newValue = newRegInfo[item];

        const updateItem = {
          updatekey: item,
          oldvalue: oldValue,
          newvalue: newValue
        };
        updateObject.push(updateItem);
      }

      console.log("updateObject", updateObject);

      // xbdm 性别  sfzh 身份证号码  csrq 出生日期
      /* // ①.判断是否包含任意一项
      const result = changeItem.includes("xbdm") ? true : changeItem.includes("sfzh") ? true : changeItem.includes("csrq") ? true : false;
      const result1 = ['xbdm','sfzh','csrq'].map(item => changeItem.includes(item));
      // ②.判断是否包含三个项
      const result2 = result1.every(item => item === true); */

      const idCard = newRegInfo.sfzh;
      const { sfzh, xbdm, csrq } = newRegInfo;

      const birthdayAndSex = this.getBirthdayAndSexByIdCard(idCard);

      if ( changeItem.includes("xbdm") || changeItem.includes("csrq") || changeItem.includes("sfzh")) {
        if (birthdayAndSex.sex !== xbdm || birthdayAndSex.birth !== csrq) {
          birthdayAndSex.sex !== xbdm ? (this.diff.xbdm = xbdm) : "";
          birthdayAndSex.birth !== csrq ? (this.diff.csrq = csrq) : "";
          // 弹出确认框
          this.saveVisible = true;
          // 存入this
          this.updateObject = updateObject;
          this.oldRegInfo = oldRegInfo;
          this.birthdayAndSex = birthdayAndSex;
        } else {
          // *************
          // 修改正确，直接调用接口
          this.setExamineeRegInfo(updateObject);
        }
      } else {
        // 没有涉及到性别和出生日期，直接调用接口
        this.setExamineeRegInfo(updateObject);
      }
    },

    // 确认变更事件
    handleOkAlter() {
      const { updateObject, oldRegInfo, birthdayAndSex } = this;
      // 确定之后的操作
      const updatekeyArr = updateObject.map(item => item.updatekey);

      if (updatekeyArr.includes("xbdm") || updatekeyArr.includes("csrq")) {
        for (let i = 0; i < updateObject.length; i++) {
          // 性别
          if (updateObject[i].updatekey === "xbdm") {
            updateObject[i].oldvalue = oldRegInfo.xbdm;
            updateObject[i].newvalue = birthdayAndSex.sex;
          }
          // 出生日期
          if (updateObject[i].updatekey === "csrq") {
            updateObject[i].oldvalue = oldRegInfo.csrq;
            updateObject[i].newvalue = birthdayAndSex.birth;
          }
        }
      } else {
        if (!updatekeyArr.includes("xbdm")) {
          updateObject.push({
            updatekey: "xbdm",
            oldvalue: oldRegInfo.xbdm,
            newvalue: birthdayAndSex.sex
          });
        }
        if (!updatekeyArr.includes("csrq")) {
          updateObject.push({
            updatekey: "csrq",
            oldvalue: oldRegInfo.csrq,
            newvalue: birthdayAndSex.birth
          });
        }
      }
      console.log("updateObject", updateObject);
      // 调用接口
      this.setExamineeRegInfo(updateObject);
      this.saveVisible = false;
    },

    /**
     * @description 从身份证号码中获取出生日期和性别
     * @param {idCard}
     * @returns {birth} 20010702
     * @returns {sex} 1男 2女
     */
    getBirthdayAndSexByIdCard(idCard) {
      const num = idCard.trim();
      let birth = "";
      let sex = "";
      // 15位
      if (num.length == 15) {
        birth = num.substring(6, 12);
        birth = "19" + birth;
        birth =
          birth.substring(0, 4) + birth.substring(4, 6) + birth.substring(6);
        sex = parseInt(num.substring(14, 1), 10) % 2 ? "1" : "2";
      } else {
        // 18位
        birth = num.substring(6, 14);
        birth =
          birth.substring(0, 4) + birth.substring(4, 6) + birth.substring(6);
        sex = parseInt(num.substring(17, 1), 10) % 2 ? "1" : "2";
      }
      return {
        birth,
        sex
      };
    },

    /**
     * @description 根据历史变更项判断此项是否曾经修改过，为 Dom加上ClassName
     * @param {String} 要判断的key
     * @returns {Boolean}
     */
    getDifferentClassName(name) {
      const { alterInfo } = this;
      const updatedKey = alterInfo.map(item => item.name);
      return updatedKey.includes(name);
    },

    /**
     * @description 两个对象对比返回key相同 值不同的key
     * @param {Obj1,Obj2}
     * @returns {Array}
     */
    getObjectSameItem(obj1, obj2) {
      const sameArray = [];
      for (const key in obj1) {
        // 两个对象都有这个key，并且值不相等
        if (
          obj1.hasOwnProperty(key) &&
          obj2.hasOwnProperty(key) &&
          obj1[key] !== obj2[key]
        ) {
          sameArray.push(key);
        }
      }
      return sameArray;
    },

    // 身份证号码input change事件
    // 如果用户修改了身份证号码
    sfzhChange(e) {
      let sfzh = e.target.value;
      sessionStorage.setItem("Nsfzh", sfzh);
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
          const regInfo = res.data.regInfo;
          const alterInfo = res.data.alterInfo;
          this.alterInfo = alterInfo;

          // 存一份请求回来的考生身份证，本地验证
          const { sfzh } = regInfo;
          sessionStorage.setItem("Osfzh", sfzh);
          //此举为了显示select 的 placeholder
          //后端返回没有数据是null，null在select里面不显示placeholder，需要改为undefined

          /* for (const key in regInfo) {
            if(regInfo[key] === null){
              regInfo[key] = undefined;
            }
          } */

          // 转换格式
          const c = this.transferFormatData(alterInfo);

          this.form = Object.assign(regInfo, c);

          // 请求回来之后存于session ，便于修改保存之后对比
          sessionStorage.setItem("regInfo", JSON.stringify(regInfo));

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
    /**
     * @description 后端返回的是由regInfo整个对象，alterInfo上次变更项组成
     * @description alterInfo 的格式为 [{name:value},{name:value}]的形式,需要转换为{}
     * @description 转换格式
     * @param {Array}
     * @returns {Object}
     */
    transferFormatData(alterInfo) {
      let a = [];
      for (const item of alterInfo) {
        let b = {
          [item.name]: item.value
        };
        a.push(b);
      }
      let c = {};
      a.map(item => {
        c = Object.assign({}, c, item);
      });
      return c;
    },
    // 更新考生信息表
    async setExamineeRegInfo(alterInfo) {
      const { wkId, bmh } = this;
      const data = { wkId, bmh };
      try {
        const res = await this.$api.WorkOrderApply.setExamineeRegInfo({
          alterInfo,
          ...data
        });
        if (res.code === "200") {
          this.$message.success("保存成功！");
          setTimeout(() => {
            this.goBack();
          }, 300);
        } else {
          this.$message.error("保存失败！" + res.message);
        }
      } catch (error) {
        console.log(error);
      }
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
.saveModal {
  .wrap {
    display: flex;
    padding: 20px;
    .tips {
      margin-left: 15px;
      p {
        margin-bottom: 5px;
      }
    }
  }
}
// updatedClass 为上次更改过的ClassName
.updatedClass.ant-input {
  background: #f3fbf6;
  border: 2px solid #39bf66;
}
.updatedClass.ant-checkbox-group {
  background: #f3fbf6;
  // padding-left: 5px;
  border: 2px solid #39bf66;
}
.updatedClass {
  background: #f3fbf6;
  border-radius: 5px;
  .ant-input {
    background: #f3fbf6;
    border: 2px solid #39bf66;
  }
  .ant-select-selection {
    border: 2px solid #39bf66;
    background: #f3fbf6;
  }
  .ant-checkbox-group {
    border: 2px solid #39bf66;
  }
}
.examinee-reg-info {
  padding: 20px;
  background: #fff;
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
  header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e6ecf2;
    h3 {
      font-size: 16px;
    }
  }
  main {
    margin-top: 40px;
    padding: 0 80px;
    /* /deep/ .ant-form-inline{
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      .ant-form-item{
        width: 20%;
      }
    } */
    /* .form-model{
      pointer-events: none;
    } */
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
  footer {
    padding: 0 100px 50px;
    .save-btn {
      margin-left: 90px;
    }
  }
}
</style>