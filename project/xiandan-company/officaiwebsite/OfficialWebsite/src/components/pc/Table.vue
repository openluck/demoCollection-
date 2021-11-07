<template>
  <div class="raffle-detail-div">
    <web-header></web-header>
    <div class="raffle-detail">
      <div class="detail-title">发起抽奖列表</div>
      <div class="detail-container">
        <div class="back">
          <button @click="back">返回</button>
        </div>
        <div class="cover-img">
          <img :src="cover" @click="chooseCoverPicture"/>
          <div class="cover-text" v-if="coverText">请插入封面</div>
          <input type="file" v-show="false" v-on:change="getFile" accept="image/*" ref="coverFileInput"/>
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
              ></vueCropper>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
          </div>
        </el-dialog>
        <div class="raffle-info">
          <p class="title-text">请填写标题</p>
          <input type="text" class="content-input" placeholder="请输入标题"  v-model="title" v-on:blur="noName"/>
          <div class="title-text">开奖条件</div>
          <el-radio-group size="mini"  v-model="limitTime" fill="#BC4343" style="margin: 14px 0" v-on:change="changeLimit">
            <el-radio-button label="时间开奖"></el-radio-button>
            <el-radio-button label="人数开奖"></el-radio-button>
          </el-radio-group>
          <div class="limit-count" v-if="limit.type === '人数开奖'">
            <span>开奖人数</span>
            <div>
              <input placeholder="人数" v-on:blur="noLimit" v-model="limit.value"/>
              <span>人</span>
            </div>
          </div>
          <div class="limit-time" v-else v-model="limit.value">
            <span class="limit-time-text">开奖时间</span>
            <div class="choose-area">
              时间选择
              <el-date-picker
                v-model="limit.value"
                type="datetime"
                class="choose-time"
                :picker-options="pickerOptions"
                placeholder="选择开奖时间"
                format="yyyy-MM-dd HH"
                value-format="yyyy-MM-dd HH:00:00"
                v-on:blur="noLimit"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="title-text">
            公共抽奖
            <span class="font-red">
            已开启公共抽奖，大家可以通过微信小程序摇一摇获得大奖
          </span>
          </div>
          <el-radio-group size="mini" v-model="open" fill="#333333" style="margin: 14px 0 28px 0" v-on:change="changeOpen">
            <el-radio-button label="关闭"></el-radio-button>
            <el-radio-button label="开启"></el-radio-button>
          </el-radio-group>
          <div>
            <p class="title-text">奖品</p>
            <div class="award-area" v-for="(item,index) in awardList" :key="index">
              <div class="award-level">
                <img :src="cancelItem" v-on:click="cancelAward(index)" v-if="index > 0"/>
                <span>{{item.awardTitle}}</span>
              </div>
              <input type="text" placeholder="请输入奖品名称" class="award-name" v-model="item.awardName" v-on:blur="noAwardName(index)"/>
              <div class="award-count">
                <div class="award-text">奖品份数</div>
                <div class="award-count-right">
                  <input type="text" class="award-input" placeholder="份数" v-model="item.awardCount" v-on:blur="noAwardCount(index)"/>
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
          <textarea type="text" placeholder="请填写商品说明" style="resize: none" class="commodity-desc" v-model="textAreaData"></textarea>
          <!--         添加照片-->
                    <ul v-for="(item,index) in showImgArg" :key="index">
                      <li>
                        <img :src="item" width="544px" height="277px" style="margin-top: 10px">
                      </li>
                    </ul>
                    <button type="button" class="add-btn" v-on:click="chooseCoverPicture" v-if="showImgArg.length < 9">
                      <span class="iconfont iconadd"></span>
                      添加图片</button>
                    <div class="mostAward" v-else>达到最大数目无法添加</div>
                    <input type="file" v-show="false" v-on:change="getFileTest" accept="image/*" ref="coverFileInput" multiple="multiple"/>
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
                          ></vueCropper>
                        </div>
                      </div>
                      <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="finishAll" :loading="loading">确认</el-button>
                      </div>
                    </el-dialog>
          <!--     ----------------------------------------     -->
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
  import { VueCropper }  from 'vue-cropper';
  import cancelItem from '../../assets/img/cancelItem.svg';
  import tcb from 'tcb-js-sdk'
  export default {
    name: "raffleDetail.vue",
    data() {
      return {
        cancelItem,
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
        open: '关闭',
        close: '开启',
        isOpen: false,
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
        option: {
          img: '', // 裁剪图片的地址
          info: true, // 裁剪框的大小信息
          outputSize: 1, // 裁剪生成图片的质量
          outputType: 'jpg', // 裁剪生成图片的格式
          canScale: false, // 图片是否允许滚轮缩放
          autoCrop: true, // 是否默认生成截图框
          autoCropWidth: 750, // 默认生成截图框宽度
          autoCropHeight: 376, // 默认生成截图框高度
          fixedBox: false, // 固定截图框大小 不允许改变
          fixed: true, // 是否开启截图框宽高固定比例
          fixedNumber: [2, 1], // 截图框的宽高比例
          full: true, // 是否输出原图比例的截图
          canMoveBox: false, // 截图框能否拖动
          original: false, // 上传图片按照原始比例渲染
          centerBox: false, // 截图框是否被限制在图片里面
          infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
        picsList: [],  //页面显示的数组
        // 防止重复提交
        loading: false,
        imgDataPath: {},
        imgData:{},
        textAreaData: '',
        showImg: '',
        showImgArg: [],
      }
    },
    components: {
      webHeader,
      webFooter,
      VueCropper,
    },
    mounted() {
      // 上传封面图片
      this.app = tcb.init({
        env: 'luck-ceo-fqpk1' //云环境id
      });
      // console.log(this.app);
    },
    methods: {
      back() {
        this.$router.back();
      },
      // 选择要裁剪照片
      chooseCoverPicture(){
        this.$refs.coverFileInput.dispatchEvent(new MouseEvent('click'))
      },
      // 改变开奖条件
      changeLimit(label) {
        this.limit.type = label;
        this.limit.value = '';
      },
      changeOpen(label) {
        this.isOpen = !this.isOpen;
      },
      // 限定可选的开奖日期
      dealDisabledDate(time) {
        if(new Date(time).getTime()>new Date().getTime()){
          // 表示当前日期之后的时间中，哪些部分禁用
          return time.getTime() >= Date.now() + 6*8.64e7;
        }else{
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
        this.awardList.splice(index,1);
        for (let i = index;i < this.awardList.length;i++) {
          this.awardList[i].awardTitle = this.levelList[i];
        }
      },
      // 判断值是否为空
      noName() {
        if(this.title === '') {
          this.$message.error({
            message:'活动标题不能为空',
            type:'warning'
          });
        }
      },
      noLimit() {
        if(this.limit.type === '人数开奖') {
          const  flag = new RegExp("^[1-9]([0-9])*$").test(this.limit.value);
          if(!flag) {
            this.$message.error({
              message:'开奖人数必须是大于0的正整数',
              type:'warning'
            });
            this.limit.value = '';
          }
        } else {
          if(this.limit.value === '') {
            this.$message.error({
              message:'请选择开奖时间',
              type:'warning'
            });
          } else if (new Date(this.limit.value) < new Date().getTime()) {
            this.$message.error({
              message:'开奖时间必须在当前时间之后',
              type:'warning'
            });
            this.limit.value = '';
          }
        }
      },
      noAwardName(index) {
        if(this.awardList[index].awardName === '') {
          this.$message.error({
            message:`${this.awardList[index].awardTitle}奖品名称不能为空`,
            type:"warning"
          });
        }
      },
      noAwardCount(index) {
        const  flag = new RegExp("^[1-9]([0-9])*$").test(this.awardList[index].awardCount);
        if(!flag) {
          this.$message.error({
            message:`${this.awardList[index].awardTitle}奖品数量必须是大于0的正整数`,
            type: 'error'
          });
          this.awardList[index].awardTitle = '';
        }
      },
      // 上传图片函数
      getFile(e){
        // 从设备中获取的图片本身并没有url，需要借助window工具生成一个可供页面使用的url
        const URL = window.URL || window.webkitURL;
        const imgURL = URL.createObjectURL(e.target.files[0]);
        this.option.img = imgURL;
        this.dialogVisible = true;
      },
      // 测试上传图片函数
      getFileTest(e){
        // 从设备中获取的图片本身并没有url，需要借助window工具生成一个可供页面使用的url
        const URL = window.URL || window.webkitURL;
        const imgURLTest = URL.createObjectURL(e.target.files[0]);
        this.option.img = imgURLTest;
        this.dialogVisible = true;
      },
      // 裁剪图片函数
      finish() {
        this.$refs.cropper.getCropBlob((data) => {
          // console.log(data);
          this.imgData = data;
          this.loading = true;
          const URL = window.URL || window.webkitURL;
          const imgURL = URL.createObjectURL(data);
          this.cover = imgURL;
          this.coverText = false;
          this.loading = false;
          this.dialogVisible = false;
        })
      },
      // 添加多张图片的裁剪函数
      finishAll() {
        this.$refs.cropper.getCropBlob((data) => {
          this.imgData = data;
          this.loading = true;
          const URL = window.URL || window.webkitURL;
          const imgURLTest = URL.createObjectURL(data);
          // this.cover = imgURL
          // console.log(this.cover);
          this.showImg = imgURLTest;
          this.showImgArg.push(this.showImg);
          this.coverText = false;
          this.loading = false;
          this.dialogVisible = false;
        })
      },
      // 发布奖励
      release() {
        const data = {};
        // 标题
        if(this.title === '') {
          this.$message.error('活动标题不能为空');
          return;
        } else {
          data.title = this.title;
        }
        // // 奖品列表
        data.gifts = [];
        for(let i = 0;i < this.awardList.length;i ++){
          if(this.awardList[i].awardName === ''){
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
        // //  是否公开
        data.is_open = this.isOpen;
        //  开奖方式,开奖时间,开奖人数
        if (this.limit.type === '人数开奖') {
          if(this.limit.value === '') {
            this.$message.error('开奖人数不能为空');
            return;
          } else {
            data.open_type = 2;
            data.open_count = parseInt(this.limit.value);
          }
        } else {
          if(this.limit.value === '') {
            this.$message.error('开奖时间不能为空');
            return;
          } else {
            data .open_type = 1;
            data.open_time = this.limit.value;
          }
        }
        // 文本域值
        data.textAreaData = this.textAreaData;
        //抽奖展示的图片列表
        data.showImgs = [];
        data.showImgs = this.showImgArg;
        console.log(data)

        // 发送封面图片到腾讯云
        // let formData = new FormData();
        // formData.append('file', this.imgData);
        // this.imgDataPath = formData;
        // const fileTimeName = new Date().getTime();
        // const result = this.app.uploadFile({
        //     cloudPath: `upload/lottery/cover${fileTimeName}.jpg`,
        //     filePath: this.imgDataPath.get('file'),
        // });
      },
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
  .raffle-detail-div{
    background: #ffffff;
  }
  .raffle-detail{
    padding: 49px 240px 56px 240px;
    .detail-title{
      height:27px;
      font-size:28px;
      font-family:PingFang SC;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:21px;
      margin-bottom: 42px;
    }
    .detail-container{
      border:1px solid rgba(232,232,232,1);
      box-sizing: border-box;
      .back{
        height:44px;
        background:rgba(232,232,232,1);
        font-size:16px;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(15,15,15,1);
        line-height:21px;
        padding: 12px 29px;
        box-sizing: border-box;
        button{
          border: none;
          outline: none;
          background: rgba(232,232,232,1);
        }
      }
      .cover-img{
        width:750px;
        height:376px;
        border-radius:15px;
        margin: 41px auto;
        position: relative;
        img{
          width: 750px;
          height: 376px;
          position: absolute;
          top: 0;
          margin: 0;
          z-index: 1;
          border-radius: 15px;
        }
        .cover-text{
          width:340px;
          height:93px;
          font-size:68px;
          pointer-events: none;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:93px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -46px;
          margin-left: -170px;
          z-index: 2;
        }
      }
      .raffle-info{
        width: 542px;
        margin: 0 auto 50px auto;
        input,button{
          display: block;
          box-sizing: border-box;
          width: 100%;
          height:48px;
          margin: 0;
          border: none;
          outline: none;
        }
        .title-text{
          height:19px;
          font-size:20px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:21px;
          .font-red{
            font-size:14px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(188,67,67,1);
            line-height:21px;
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
        .limit-time,.limit-count{
          display: flex;
          margin: 20px 0 34px 0;
          height:48px;
          background:rgba(247,247,247,1);
          color: #333333;
          padding: 16px 28px;
          box-sizing: border-box;
          color: #666666;
          justify-content: space-between;
          font-size: 16px;
        }
        .limit-time{
          .choose-area{
            position: relative;
          }
          .choose-time{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
          }
        }
        .limit-count{
          padding: 16px 28px;
          div{
            width: 80px;
            display: flex;
            justify-content: space-between;
          }
          input{
            font-size: 16px;
            width: 48px;
            height: 16px;
            background: #f7f7f7;
            margin-top: 3px;
          }
        }
        .content-input{
          background:rgba(247,247,247,1);
          font-size:16px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          padding: 16px 29px;
          margin: 14px 0 28px 0;
        }
        .award-area{
          .award-level{
            margin: 23px 0 14px 0;
            font-size:16px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(204,74,74,1);
            line-height:21px;
            display: flex;
            img{
              margin-right: 15px;
            }
          }
          .award-name{
            background:rgba(247,247,247,1);
            padding: 16px 29px;
          }
          .red-font{
            color: rgba(204,74,74,1);
          }
          .award-count{
            display: flex;
            box-sizing: border-box;
            justify-content: space-between;
            padding: 16px 28px;
            background:rgba(247,247,247,1);
            margin: 14px 0;
            .award-text{
              width: 80%;
            }
            .award-count-right{
              display: flex;
              justify-content: space-between;
              width: 60px;
            }
            .award-input{
              height: 16px;
              width: 31px;
              margin-top: 4px;
              background:rgba(247,247,247,1);
            }
          }
        }
        .add-btn{
          background: #ffffff;
          height:48px;
          border:1px solid rgba(188,67,67,1);
          font-size:16px;
          font-weight:500;
          color:rgba(188,67,67,1);
          line-height:21px;
          margin-bottom: 42px;
        }
        .mostAward{
          height:48px;
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
        .commodity-desc{
          display: block;
          width: 100%;
          border: none;
          box-sizing: border-box;
          outline: none;
          height: 165px;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:bold;
          color:rgba(51,51,51,1);
          line-height:21px;
          margin: 14px 0 28px 0;
          background:rgba(247,247,247,1);
          padding: 12px 14px;
        }
        .release-btn{
          height:48px;
          margin-top: 28px;
          background:rgba(188,67,67,1);
          font-size:20px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:21px;
          text-align: center;
        }
      }
    }
  }
</style>
