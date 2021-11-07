<template>
  <div class="raffle-detail-div">
    <div class="showCode" @mousewheel.prevent v-if="showQrcode" @click="disappearCode" >
      <div class="qrcode-border" >
        <div class="qrcode-content">
          <span class="security-login">微信安全登陆</span>
          <div class="qrcode-content-border" v-loading="loading">
            <!--            <div id="qrcode"></div>-->
            <vue-qrcode :value="qrCodeUrl" :width="220" style="margin-top: 5px" ></vue-qrcode>
          </div>
          <span class="scanning-login">微信扫描二维码登陆</span>
        </div>
      </div>
    </div>
    <web-header></web-header>
    <div class="raffle-detail">
      <div class="detail-title">发起抽奖</div>
      <div class="detail-container">
        <div class="back">
          <button @click="back">返回</button>
        </div>
        <div class="cover-img">
          <img :src="cover" @click="chooseCoverPicture" >
          <div class="cover-text" v-if="coverText">请插入封面</div>
              <span class="changeRaffleImg" v-if="showChangCoverImg" @click="chooseCoverPicture" >更换抽奖封面</span>
          <form>
          <input type="file" v-show="false" v-on:change="getFile" accept="image/*" ref="coverFileInput"/>
          </form>
        </div>

        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" append-to-body>
          <div class="cropper-content">
            <div class="cropper" style="text-align:center">
              <vueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :coverName = "option.coverName"
                :enlarge = "option.enlarge"
              ></vueCropper>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelCrop">取 消</el-button>
            <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
          </div>
        </el-dialog>
        <div class="raffle-info">
          <p class="title-text">请填写标题</p>
          <input type="text" class="content-input" placeholder="请输入标题(16字以内)" v-model="title" v-on:blur="noName"
                 maxlength="16"/>
          <div class="title-text">开奖条件</div>
          <el-radio-group size="mini" v-model="limitTime" fill="#BC4343" style="margin: 14px 0"
                          v-on:change="changeLimit">
            <el-radio-button label="时间开奖"></el-radio-button>
            <el-radio-button label="人数开奖"></el-radio-button>
          </el-radio-group>
          <!--          人数开奖选择-->
          <div class="limit-count" v-if="limit.type === '人数开奖'">
            <span>开奖人数</span>
            <div>
              <input placeholder="人数" v-on:blur="noLimit" v-model="limit.value"
                     oninput="value=value.replace(/[^\d]/g,'')"/>
              <span>人</span>
            </div>
          </div>
          <div class="limit-time" v-else>
            <!--       日期选择    -->
            <el-select v-model="date" placeholder="请选择开奖日期">
              <el-option
                v-for="(item,index) in weeksOption"
                :key="index"
                :value="item">
              </el-option>
            </el-select>
            <!--            时间选择-->
            <el-select v-model="time" placeholder="请选择开奖时间">
              <el-option
                v-for="(item,index) in timeOptions"
                :key="index"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="title-text">
            公共抽奖
            <span class="font-red" v-if="isOpen === 1">
<!--            已{{ isOpen === 0 ? '关闭' : '开启'}}公共抽奖，大家可以通过微信小程序摇一摇获得大奖 -->
            已开启公共抽奖，大家可以通过微信小程序摇一摇获得大奖
          </span>
          </div>
          <div class="openOrshut">
            <span :class="isOpen === 0 ? 'open' : 'shutdown'" @click="changeOpen">关闭</span>
            <span :class="isOpen === 1 ? 'openRed' : 'shutdown' " @click="changeOpen">开启</span>
          </div>
          <div>
            <p class="title-text">奖品</p>
            <div class="award-area" v-for="(item,index) in awardList" :key="index">
              <div class="award-level">
                <img :src="cancelItem" v-on:click="cancelAward(index)" v-if="index > 0"/>
                <span>{{item.awardTitle}}</span>
              </div>
              <input type="text" placeholder="请输入奖品名称(10字以内)" class="award-name" v-model="item.awardName"
                     v-on:blur="noAwardName(index)" maxlength="10"/>
              <div class="award-count">
                <div class="award-text">奖品份数</div>
                <div class="award-count-right">
                  <input type="text" class="award-input" placeholder="份数" v-model="item.awardCount"
                         v-on:blur="noAwardCount(index)" oninput="value=value.replace(/[^\d]/g,'')"/>
                  <span>个</span>
                </div>
              </div>
            </div>
            <button class="add-btn" v-on:click="addAward" v-if="awardList.length < 10">
              <span class="iconfont iconadd"></span>
              添加新奖项
            </button>
            <div class="mostAward" v-else>达到最大数目无法添加</div>
          </div>
          <p class="title-text">说明</p>
          <textarea type="text" placeholder="请填写商品说明" style="resize: none" class="commodity-desc" @input="descInput"
                    v-model="areaData" maxlength="500"/>
          <span class="remain">{{remnant}}/500</span>
          <!--          添加展示列表图片-->
          <ul v-for="(item,index) in showImgArg" :key="index">
            <li class="show-img">
              <img :src="item"  style="margin-top: 10px;">
              <span class="iconfont iconcancel" @click="delShowImg(index)"></span>
            </li>
          </ul>
          <button type="button" class="add-btn" v-on:click="chooseShowPictureList" v-if="showImgArg.length < 9">
            <span class="iconfont iconadd"></span>
            添加图片
          </button>
          <div class="mostAward" v-else>达到最大数目无法添加</div>
          <input type="file" v-show="false" v-on:change="getFileList" accept="image/*" ref="coverFileInputList"/>
          <!--          -->
          <button class="release-btn" v-on:click="release">发布抽奖</button>
        </div>
      </div>
    </div>
    <web-footer></web-footer>
  </div>
</template>

<script>
  import cover from '../../assets/img/cover.png';
  import webHeader from './WebHead';
  import webFooter from './WebFooter';
  import {VueCropper} from 'vue-cropper';
  import cancelItem from '../../assets/img/cancelItem.svg';
  import publicSuccess from '@/assets/img/publicSuccess.svg';
  import publicFail from '@/assets/img/publicFail.svg';
  import tcb from 'tcb-js-sdk';
  import {Loading} from 'element-ui';
  import Vue from 'vue';
  import VueQrcode from 'vue-qrcode'

  Vue.use(Loading);
  export default {
    name: "raffleDetail.vue",
    data() {
      return {
        cancelItem,
        publicSuccess,
        remnant: 500,
        title: '',
        limitTime: '时间开奖',
        limitCount: '人数开奖',
        limit: {
          type: '时间开奖',
          value: '',
        },
        pickerOptions: {
          disabledDate: (time) => {
            return this.dealDisabledDate(time);
          },
        },
        // 0为关闭
        isOpen: 0,
        cover,
        coverText: true,
        value: null,
        awardList: [{
          awardTitle: '一等奖',
          awardName: '',
          awardCount: '',
        }],
        levelList: ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '九等奖', '十等奖'],
        // 裁剪图片框信息
        dialogVisible: false, //是否显示裁剪框
        dialogVisibleList: false,
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 1, // 裁剪生成图片的质量
          outputType: 'jpg', // 裁剪生成图片的格式
          canScale: true, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 300, // 默认生成截图框宽度
          autoCropHeight: 300, // 默认生成截图框高度
          fixedBox: true, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          // fixedNumber: [2, 1], // 截图框的宽高比例
          full: false, // 是否输出原图比例的截图
          canMoveBox: false, // 截图框能否拖动
          original: true, // 上传图片按照原始比例渲染
          centerBox: true, // 截图框是否被限制在图片里面
          infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
          enlarge: 1, // 图片根据截图框输出比例倍数
        },
        picsList: [],  //页面显示的数组
        // 防止重复提交
        loading: false,
        imgDataFile: [],
        showImgDataFile: [],
        coverImgDataFile: [],
        cancelImgDataFile:[],
        areaData: '',
        showImgArg: [],
        filePath: '',
        date: '',
        time: '',
        coverName: '',
        refToken: '',
        temToken: '',
        showQrcode: false,
        qrCodeUrl:'',
        dataObj:'',
        showChangCoverImg:false,
        imgCanelURL: '',
      }
    },
    components: {
      webHeader,
      webFooter,
      VueCropper,
      VueQrcode
    },
    computed: {
      weeksOption: function () {
        const week = [];
        for (let i = 0; i < 7; i++) {
          let date = new Date();
          date.setDate(date.getDate() + i);
          week.push(date.getFullYear() + '-' +'0'+ (date.getMonth() + 1) + '-' + date.getDate())
        }
        return week;
      },
      timeOptions: function () {
        const date = new Date();
        const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
          , '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
          '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
        if (this.date === (date.getFullYear() + '-' + '0' + (date.getMonth() + 1) + '-' + date.getDate())) {
          return times.slice(date.getHours() + 1, 24);
        }
        return times;
      }
    },
    watch: {
      'date': function (newVal) {
        const date = new Date();
        // if (newVal === (date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate())) {
        //   this.time = null;
        // }
        this.time = null;
      }
    },
    mounted() {
      this.app = tcb.init({
        env: 'luck-ceo-fqpk1' //云环境id
      });
    },
    methods: {
      back() {
        this.$router.back();
      },
      // 改变开奖条件
      changeLimit(label) {
        this.limit.type = label;
        this.limit.value = '';
      },
      changeOpen() {
        if (this.isOpen === 0) {
          this.isOpen = 1;
        } else {
          this.isOpen = 0;
        }
      },
      // 限定可选的开奖日期
      dealDisabledDate(time) {
        if (new Date(time).getTime() > new Date().getTime()) {
          // 表示当前日期之后的时间中，哪些部分禁用
          return time.getTime() >= Date.now() + 6 * 8.64e7;
        } else {
          // 表示当前日期之前的时间中，哪些部分禁用
          return time.getTime() < Date.now();
        }
      },
      // 添加奖励
      addAward() {
        const level = {
          awardTitle: this.levelList[this.awardList.length],
          awardName: '',
          awardCount: '',
        };
        this.awardList.push(level);
      },
      // 删除奖励
      cancelAward(index) {
        this.awardList.splice(index, 1);
        for (let i = index; i < this.awardList.length; i++) {
          this.awardList[i].awardTitle = this.levelList[i];
        }
      },
      // 判断值是否为空
      noName() {
        if (this.title === '') {
          this.$message.error({
            message: '活动标题不能为空',
            type: 'warning'
          });
        }
      },
      noLimit() {
        if (this.limit.type === '人数开奖') {
          const flag = new RegExp("^[1-9]([0-9])*$").test(this.limit.value);
          if (!flag) {
            this.$message.error({
              message: '开奖人数必须是大于0的正整数',
              type: 'warning'
            });
            this.limit.value = '';
          }
        } else {
          if (this.limit.value === '') {
            this.$message.error({
              message: '请选择开奖时间',
              type: 'warning'
            });
          } else if (new Date(this.limit.value) < new Date().getTime()) {
            this.$message.error({
              message: '开奖时间必须在当前时间之后',
              type: 'warning'
            });
            this.limit.value = '';
          }
        }
      },
      noAwardName(index) {
        if (this.awardList[index].awardName === '') {
          this.$message.error({
            message: `${this.awardList[index].awardTitle}奖品名称不能为空`,
            type: "warning"
          });
        }
      },
      noAwardCount(index) {
        const flag = new RegExp("^[1-9]([0-9])*$").test(this.awardList[index].awardCount);
        if (!flag) {
          this.$message.error({
            message: `${this.awardList[index].awardTitle}奖品数量必须是大于0的正整数`,
            type: 'error'
          });
          this.awardList[index].awardTitle = '';
        }
      },
      // 裁剪的封面图片函数
      chooseCoverPicture() {
        this.$refs.coverFileInput.dispatchEvent(new MouseEvent('click'))
        // this.showChangCoverImg = true;
      },
      // 上传封面图片函数
      getFile(e) {
        // 从设备中获取的图片本身并没有url，需要借助window工具生成一个可供页面使用的url
        const URL = window.URL || window.webkitURL;
        const imgURL = URL.createObjectURL(e.target.files[0]);
        this.option.img = imgURL;
        this.coverNme = e.target.files[0].name;
        console.log('1111')
        this.dialogVisible = true;
        // 清空input内容 避免下一次选择同样文件无法触发change事件
        this.$refs.coverFileInput.value = ''
      },
      // 裁剪封面图片函数
      finish() {
        this.$refs.cropper.getCropBlob((data) => {
          this.dataObj = data;
          this.coverImgDataFile.push(data);
          this.loading = true;
          const URL = window.URL || window.webkitURL;
          const imgURL = URL.createObjectURL(data);
          this.cover = imgURL;
          this.coverText = false;
          this.showChangCoverImg = true;
          this.loading = false;
          this.dialogVisible = false;
        })
      },
      // 取消裁剪框
      cancelCrop() {
        this.option.img = '';
        console.log(this.coverImgDataFile);
        // this.coverImgDataFile = '';
          this.dialogVisible = false;
      },
      //--------------------------------------
      // 裁剪展示图片函数
      chooseShowPictureList() {
        this.$refs.coverFileInputList.dispatchEvent(new MouseEvent('click'))
      },
      // 上传展示图片函数
      getFileList(e) {
        // 从设备中获取的图片本身并没有url，需要借助window工具生成一个可供页面使用的url
        const URL = window.URL || window.webkitURL;
        const imgURLList = URL.createObjectURL(e.target.files[0]);
        this.showImgDataFile.push(e.target.files[0]);
        this.showImgArg.push(imgURLList);
      },
      //---------------------------
      // 删除展示图片
      delShowImg(index) {
        this.showImgArg.splice(index, 1);
      },
      // 显示文本剩余数字
      descInput() {
        let txtVal = this.areaData.length;
        this.remnant = 500 - txtVal;
      },

      // 发布抽奖
      release() {

        // 发布之前检查用户token是否过期
        this.$http.get('/user/refresh_token', {params : { skey: global.token }}).then(res => {
          if(res.data.code === -1) {
            let loadingInstance = Loading.service();
            this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
              loadingInstance.close();
            });
            this.showQrcode = true;
            // 请求临时访问token，展示二维码
            this.loading = true;
            this.$http.get('/lottery/access_token').then((res) => {
              this.loading = false;
              this.temToken = res.data.data.access_token;
              // 通过获取临时token，拼接字符串生成二维码
              this.qrCodeUrl = "https://lottery.hopeyoo.com/wechat/auth/" + this.temToken;
              // 请求正式token，扫描二维码登陆
              setTimeout(() => {
                this.checkLogin();
              }, 1000);
            })
          }else if(res.data.code === 0) {
            this.public(data).then(resp => {
              if (resp.data.data.lottery_id) {
                this.disappearLoading();
                this.$alert(` <div><img src=${publicSuccess} style="width: 201px;height: 201px"/><p style="margin-top: 20px">发布成功,请关闭此弹框查看发布列表</p></div>`, '发布成功', {
                  dangerouslyUseHTMLString: true,
                  center: true,
                  showConfirmButton: false,
                });
                setTimeout(() => {
                  this.$router.push({name: 'raffle'})
                }, 1000)
              } else {
                this.disappearLoading();
                this.$alert(`<div><img src=${publicFail} style="width: 201px;height: 201px"/><p style="margin-top: 20px">发布失败</p></div>`, '可能是网络问题造成失败，请再次提交', {
                  dangerouslyUseHTMLString: true,
                  center: true,
                  showConfirmButton: false,
                });
              }
            }).catch(err => {
              console.log(err);
            })
          }else {
            this.disappearLoading();
            this.$alert(`<div><img src=${publicFail} style="width: 201px;height: 201px"/><p style="margin-top: 20px">发布失败</p></div>`, '可能是网络问题造成失败，请再次提交', {
              dangerouslyUseHTMLString: true,
              center: true,
              showConfirmButton: false,
            });
          }
        })

        const data = {};
        // 封面图片
        if( this.coverImgDataFile.length === 0 ) {
          this.$message.error('请选择封面图片');
          return;
        }
        // 标题
        if (this.title === '') {
          this.$message.error('活动标题不能为空');
          return;
        } else {
          data.title = this.title;
        }
        //  开奖方式,开奖时间,开奖人数
        if (this.limit.type === '人数开奖') {
          if (this.limit.value === '') {
            this.$message.error('开奖人数不能为空');
            return;
          } else {
            data.open_type = 2;
            data.open_count = parseInt(this.limit.value);
          }
        }else {
          if (this.date !== '' && this.time !== '' && typeof this.time !== "object") {
            data.open_type = 1;
            data.open_time = this.date+ ' ' + this.time + ':00';

          } else {
            console.log(this.date, this.time);
            this.$message.error('开奖日期不能为空');
            return;
          }
        }
        // 奖品列表
        data.gifts = [];
        for (let i = 0; i < this.awardList.length; i++) {
          if (this.awardList[i].awardName === '') {
            this.$message.error(`${this.awardList[i].awardTitle}奖品名称不能为空`);
            return;
          } else if (this.awardList[i].awardCount === '') {
            this.$message.error(`${this.awardList[i].awardTitle}奖品数量不能为空`);
            return;
          } else {
            const gift = {
              name: this.awardList[i].awardName,
              count: this.awardList[i].awardCount,
            }
            data.gifts.push(gift);
          }
        }
        //  是否公开
        data.is_open = this.isOpen;
        // form_id
        data.form_id = '';
        // 描述发布信息
        if (this.areaData === '') {
          this.$message.error('抽奖描述为空');
          return;
        } else {
          data.intro = this.areaData;
        }
        // 发布抽奖
        Loading.service({text : '发布抽奖中...'});

      },
      async public(data) {
        const Header = {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
        await this.$http.get('/user/refresh_token', { params : { skey: global.token }});
        // 封面图片
        let formDataCover = new FormData();
        formDataCover.append('file', this.coverImgDataFile[0], this.coverNme);
        formDataCover.append('folder', 'upload/lottery/cover');
        let resp = await this.$http.post('/upload', formDataCover, Header);
        data.cover = resp.data.data.fileId;
        data.images = [];
        for (let i = 0; i < this.showImgDataFile.length; i++) {
          formDataCover = new FormData();
          formDataCover.append('file', this.showImgDataFile[i]);
          formDataCover.append('folder', 'upload/lottery/pictures');
          const fileId = (await this.$http.post('/upload', formDataCover, Header)).data.data.fileId;
          // const fileId =  (await this.$http.post('/upload',  {params:{ file:this.showImgDataFile[i], folder: 'upload/lottery/pictures'}} , Header)).data.data.fileId;
          data.images.push(fileId)
        }
        // 发布抽奖
        let headerConfig = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        return await this.$http.post('lottery/publish', data, headerConfig)
      },

      //token过期用户重新登陆
      login() {
        //已经登陆
        if (global.token) {
          // 延长token的时间
          this.$http.get('/user/refresh_token', {params : { skey: global.token }});
          return;
        }
        this.showQrcode = true;
        // 请求临时访问token，展示二维码
        this.loading = true;
        this.$http.get('/lottery/access_token').then((res) => {
          this.loading = false;
          this.temToken = res.data.data.access_token;
          // 通过获取临时token，拼接字符串生成二维码
          this.qrCodeUrl = "https://lottery.hopeyoo.com/wechat/auth/" + this.temToken;
          // 请求正式token，扫描二维码登陆
          setTimeout(() => {
            this.checkLogin();
          }, 1000)
        })
      },
      // 检查登陆
      checkLogin() {
        this.$http.get(`/lottery/check_login`, {params: {token: this.temToken}}).then((res) => {
          if (res.data.code === 1) {
            this.loading = false;
            this.showQrcode = false;
            global.token = res.data.data.token;
            this.$http.defaults.headers['X-WX-Skey'] = global.token;
            token = global.token;
          }
          else if (res.data.code === 0) {
            setTimeout(() => {
              this.checkLogin();
            }, 1000)
          } else {
            this.$message.error({
              message: '可能因为网络原因，请重新刷新网页进行扫描登陆！'
            });
            this.disappearLoading();
            this.showQrcode = false;
          }

        })
      },
      // 二维码消失
      disappearCode() {
        this.showQrcode = false;
      },
      // 取消加载loading
      disappearLoading() {
        let loadingInstance = Loading.service();
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      }
    },
  }
</script>

<style scoped lang="scss">
  .cropper-content {
    .cropper {
      width: auto;
      height: 300px;
    }
  }

  .raffle-detail-div {
    background: #ffffff;
  }

  .raffle-detail {
    padding: 49px 240px 56px 240px;

    .detail-title {
      height: 27px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 21px;
      margin-bottom: 42px;
    }

    .detail-container {
      border: 1px solid rgba(232, 232, 232, 1);
      box-sizing: border-box;

      .back {
        height: 44px;
        background: rgba(232, 232, 232, 1);
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(15, 15, 15, 1);
        line-height: 21px;
        padding: 12px 29px;
        box-sizing: border-box;

        button {
          border: none;
          outline: none;
          background: rgba(232, 232, 232, 1);
        }
      }

      .cover-img {
        /*height: 376px;*/
        border-radius: 15px;
        /*margin: 41px 22.5%;*/
        margin: 41px;
        text-align: center;
        position: relative;


        img {
          /*width: 100%;*/
          /*height: 376px;*/
          /*position: absolute;*/
          /*top: 0;*/
          /*margin: 0;*/
          /*z-index: 1;*/
          border-radius: 15px;
          max-width: 750px;
          /*max-width: 476px;*/

        }

        .cover-text {
          width: 340px;
          height: 93px;
          font-size: 68px;
          pointer-events: none;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 93px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -46px;
          margin-left: -170px;
          z-index: 2;
        }

        .changeRaffleImg {

          width: 120px;
          height: 36px;
          line-height: 36px;
          background-color: #262626;
          opacity: .5;
          position: absolute;
          display: inline-block;
          border-radius: 16px;
          color: white;
          font-size: 15px;
          /*<!--top: -71px;-->*/
          right: 43%;
          top: 14px;

        }

      }

      .raffle-info {
        width: 542px;
        margin: 0 auto 50px auto;

        input, button {
          display: block;
          box-sizing: border-box;
          width: 100%;
          height: 48px;
          margin: 0;
          border: none;
          outline: none;
        }

        .title-text {
          height: 19px;
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 21px;

          .font-red {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(188, 67, 67, 1);
            line-height: 21px;
          }
        }

        .openOrshut {
          /*background-color: blue;*/
          margin-top: 28px;
          margin-bottom: 23px;
          font-size: 8px;
          .shutdown {
            width: 55px;
            height: 27px;
            line-height: 27px;
            background: rgba(247, 247, 247, 1);
            border-radius: 0px 2px 2px 0px;
            display: inline-block;
            text-align: center;
            color: black;
          }

          .open {
            width: 55px;
            height: 27px;
            line-height: 27px;
            background: rgba(51, 51, 51, 1);
            border-radius: 2px 0px 0px 2px;
            display: inline-block;
            text-align: center;
            color: #ffffff;
          }

          .openRed {
            width: 55px;
            height: 27px;
            line-height: 27px;
            background: rgba(188, 67, 67, 1);
            border-radius: 2px 0px 0px 2px;
            display: inline-block;
            text-align: center;
            color: #ffffff;
          }
        }

        .editorx_body {
          /* width: 62%;
          margin-left: 15%; */
          /*width: 80%;*/
          /*margin: 0 auto;*/
          margin-top: 14px;
          border: 2px solid #f1f3f5;
          box-sizing: border-box;
        }

        .limit-time, .limit-count {
          display: flex;
          margin: 14px 0 28px 0;
          height: 80px;
          line-height: 50px;
          background: rgba(247, 247, 247, 1);
          color: #333333;
          padding: 16px 28px;
          box-sizing: border-box;
          color: #666666;
          justify-content: space-between;
          font-size: 16px;
        }

        .limit-time {
          .choose-area {
            position: relative;
          }

          .choose-time {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
          }
        }

        .limit-count {
          padding: 16px 28px;

          div {
            /*width: 80px;*/
            width: 80%;
            display: flex;
            justify-content: space-between;
          }

          input {
            font-size: 16px;
            /*width: 48px;*/
            width: 100%;
            text-align: right;
            height: 44px;
            background: #f7f7f7;
            margin-top: 3px;
          }
        }

        .content-input {
          background: rgba(247, 247, 247, 1);
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          padding: 16px 29px;
          margin: 14px 0 28px 0;
        }

        .award-area {
          .award-level {
            margin: 14px 0 14px 0;
            font-size: 16px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(204, 74, 74, 1);
            line-height: 21px;
            display: flex;

            img {
              margin-right: 15px;
            }
          }

          .award-name {
            background: rgba(247, 247, 247, 1);
            padding: 16px 29px;
          }

          .red-font {
            color: rgba(204, 74, 74, 1);
          }

          .award-count {
            display: flex;
            box-sizing: border-box;
            justify-content: space-between;
            padding: 16px 28px;
            background: rgba(247, 247, 247, 1);
            margin: 14px 0;

            .award-text {
              /*width: 80%;*/
              width: 14%;
            }

            .award-count-right {
              display: flex;
              justify-content: space-between;
              /*width: 60px;*/
              width: 85%;
              input::-webkit-input-placeholder {
                font-size: 16px;
              }
            }

            .award-input {
              height: 16px;
              /*width: 31px;*/
              margin-top: 4px;
              background: rgba(247, 247, 247, 1);
              text-align: right;
            }
          }
        }

        .add-btn {
          background: #ffffff;
          height: 48px;
          border: 1px solid rgba(188, 67, 67, 1);
          font-size: 16px;
          font-weight: 500;
          color: rgba(188, 67, 67, 1);
          line-height: 21px;
          margin-bottom: 42px;
        }

        .mostAward {
          height: 48px;
          color: #ffffff;
          background: #666666;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          padding-top: 13px;
          box-sizing: border-box;
          line-height: 21px;
          margin-bottom: 42px;
        }

        .commodity-desc {
          display: block;
          width: 100%;
          border: none;
          box-sizing: border-box;
          outline: none;
          height: 165px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          line-height: 21px;
          margin: 14px 0 0 0;
          background: rgba(247, 247, 247, 1);
          padding: 12px 14px;
        }

        .remain {
          float: right;
          /*margin-bottom: 28px;*/
        }

        .release-btn {
          height: 48px;
          margin-top: 28px;
          background: rgba(188, 67, 67, 1);
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 21px;
          text-align: center;
        }
      }
    }
  }

  .show-img {
    border: 1px solid #e8e8e8;
    position: relative;
    margin-top: 26px;
    text-align: center;
    img {
      max-width: 542px;
    }
  }

  .iconcancel {
    position: absolute;
    top: 0;
    right: 0;
    /*float: right;*/
  }

  .el-message-box__title {
    font-weight: 800;
  }
  .showCode {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, .3);
    z-index: 2;

    .qrcode-border {
      width: 350px;
      height: 350px;
      background-color: #FBFBFB;
      margin: 18% auto;
      border-radius: 10px;
      text-align: center;

      .qrcode-content {
        padding-top: 31px;
        text-align: center;

        .security-login {
          font-size: 17px;
          font-family: PingFang SC;
          font-weight: 800;
          color: rgba(51, 51, 51, 1);
          line-height: 12px;
          padding-top: 31px;
        }

        .qrcode-content-border {
          border: 1px solid #E2E2E2;
          width: 221px;
          height: 226px;
          margin: 12px auto;
          text-align: center;
          #qrcode {
            /*padding-left: 100px;*/
            padding-top: 10px;
            padding-left: 15px;
            padding-bottom: 10px;
            text-align: center;
            z-index: 3;
          }
        }

        .scanning-login {
          font-size: 9px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 12px;
        }
      }
    }
  }
</style>
