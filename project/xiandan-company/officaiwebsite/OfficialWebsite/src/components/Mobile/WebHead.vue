<template>
     <div :class="{ 'header-container': true}" @touchmove.prevent>
      <div class="M_web_head" @touchmove.prevent>
        <img src="../../assets/img/logo.svg" alt="">
        <span class="iconfont iconlist" v-on:click="toggleNavBar"></span>
      </div>
      <div class="navigation-bar" v-if="showNavBar"  v-on:click="toggleNavBar">
        <ul v-on:click.stop="">
          <li class="menu"></li>
          <li :class="{'red-font': item.path === selectedPath}"
              v-for="(item,index) in barName" :key="index"
              v-on:click="changePage(index)">
            {{item.name}}
          </li>
        </ul>
        <span class="iconfont iconcancel"></span>
      </div>
    </div>
</template>

<script>
  import logo from '../../assets/img/logo.svg'
    export default {
      data() {
        return {
          barName: [
            { name: '首页', path: 'Mobile' },
            { name: '公司业务', path: 'mBusiness' },
            { name: '案例展示', path: 'MCase' },
            { name: '解决流程', path: 'MSolve' },
            { name: '联系我们', path: 'MContact' },
          ],
          showNavBar: false,
          selectedPath: '',
          test: false,
          logo,
        }
      },
      created() {
        this.selectedPath = this.$route.name;
      },
      methods: {
            popup() {
                this.$emit('msg', true)
            },
          changePage(index) {
              this.$router.replace({name: this.barName[index].path});
              this.toggleNavBar();
          },
          toggleNavBar(){
              this.showNavBar = !this.showNavBar;
          },
          // 禁止弹框滑动
          noScroll(event) {
              event.preventDefault()
          }
        }
    }
</script>

<style scoped lang="scss">
  .header-container{
    /*position: relative;*/
    .M_web_head {
      width: 100%;
      padding: 14px 12px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      background:rgba(188,67,67,1);
      img {
        height: 30px;
        box-sizing: border-box;
      }
      .iconlist{
        color: #ffffff;
        display: block;
        padding-top: 4px;
      }
    }
    .navigation-bar{
      position: fixed;
      width:100%;
      height: 100vh;
      box-sizing: border-box;
      background: rgba(51,51,51,.3);
      z-index: 20;
      top: 0;
      right: 0;
      ul{
        float: right;
        background: #ffffff;
        padding: 15px 0;
        margin-left: 20px;
        width: 150px;
        height: 100vh;
        text-align: center;
        li{
          font-size:15px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(102,102,102,1);
          line-height:10.5px;
          margin-bottom: 33px;
        }
        .red-font{
          color:rgba(188,67,67,1);
        }
        .menu{
          font-size:15px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:10.5px;
          margin-bottom: 16px;
        }
      }
      .iconcancel{
        float: right;
        color: #ffffff;
        margin-top: 30px;
      }
    }
  }
  .bodyFixed {
    position: fixed;
  }
</style>
