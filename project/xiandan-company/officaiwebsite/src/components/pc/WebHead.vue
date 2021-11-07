<template>
  <div style="background: rgba(188,67,67,1); width: 100% ">
    <div class="web-head">
     <div class="header-logo">
       <img :src="logo" class="logo"/>
     </div>
      <div class="header-middle">
        <ul class="header-bar">
          <li v-for="(item,key) in barName" :key="key" @click="changePage(key)"
              :class="{'header-bar-item': true,'activity': item.path === selectedPathName}">
            {{item.name}}
          </li>
        </ul>
      </div>
      <div class="header-tel">
        <span class="iconfont iconphone"></span>
        <div class="tel-list">
          <p>+ (86) 28 67649839</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import logo from '../../assets/img/logo.svg'
  export default {
    name: "WebHead",
    data() {
      return {
        logo,
        barName: [
          {name: '首页', path:'home'},
          {name: '公司业务', path: 'MainBusiness'},
          {name: '案例展示', path: 'Case'},
          {name: '解决流程', path: 'Solve'},
          {name: '联系我们', path: 'Contact'}
        ],
        selectedPathName: 'home',
        test: '',
      }
    },
    created() {
      this.selectedPathName = this.$route.name === 'PcIndex'? "home":this.$route.name;
    },
    methods: {
      changePage(index) {
        this.$router.replace({name:this.barName[index].path})
      },
    }
  }
</script>

<style scoped lang="scss">
  /*.web-head{*/
  /*  height:60px;*/
  /*  background:rgba(188,67,67,1);*/
  /*  display: flex;*/
  /*  justify-content: space-between;*/
  /*  margin: 0 12.5%;*/
  /*  box-sizing: border-box;*/
  /*  vertical-align: middle;*/
  /*  !*min-width: 1260px;*!*/
  /*  .header-logo{*/
  /*    !*width: 14%;*!*/
  /*    box-sizing: border-box;*/
  /*    margin-top: 5px;*/
  /*    .logo {*/
  /*      width: 90%;*/
  /*    }*/
  /*  }*/
  /*  .header-middle{*/
  /*    color: #ffffff;*/
  /*    width: 618px;*/
  /*    .header-bar{*/
  /*      display: flex;*/
  /*      padding-top: 22px;*/
  /*      box-sizing: border-box;*/
  /*      height: 100%;*/
  /*      justify-content: space-between;*/
  /*      .header-bar-item{*/
  /*        text-align: center;*/
  /*        box-sizing: border-box;*/
  /*        height: 100%;*/
  /*      }*/
  /*      .activity{*/
  /*        border-bottom: 2px solid #ffffff;*/
  /*      }*/
  /*    }*/
  /*  }*/
  /*  .header-tel{*/
  /*    color: #ffffff;*/
  /*    padding-top: 12px;*/
  /*    display: flex;*/
  /*    justify-content: space-between;*/
  /*    .iconfont{*/
  /*      font-size: 36px;*/
  /*    }*/
  /*    .tel-list{*/
  /*      display: inline-block;*/
  /*    }*/
  /*  }*/
  /*}*/
  /*@media screen  and (max-width: 1396px){*/
  /*  .web-head{*/
  /*    height:60px;*/
  /*    background:rgba(188,67,67,1);*/
  /*    display: flex;*/
  /*    justify-content: space-between;*/
  /*    margin: 0 5%;*/
  /*    box-sizing: border-box;*/
  /*    vertical-align: middle;*/
  /*    !*min-width: 1260px;*!*/
  /*    .header-logo{*/
  /*      !*width: 14%;*!*/
  /*      box-sizing: border-box;*/
  /*      margin-top: 5px;*/
  /*      .logo {*/
  /*        width: 90%;*/
  /*      }*/
  /*    }*/
  /*    .header-middle{*/
  /*      color: #ffffff;*/
  /*      width: 618px;*/
  /*      .header-bar{*/
  /*        display: flex;*/
  /*        padding-top: 22px;*/
  /*        box-sizing: border-box;*/
  /*        height: 100%;*/
  /*        justify-content: space-between;*/
  /*        .header-bar-item{*/
  /*          text-align: center;*/
  /*          box-sizing: border-box;*/
  /*          height: 100%;*/
  /*        }*/
  /*        .activity{*/
  /*          border-bottom: 2px solid #ffffff;*/
  /*        }*/
  /*      }*/
  /*    }*/
  /*    .header-tel{*/
  /*      color: #ffffff;*/
  /*      padding-top: 12px;*/
  /*      display: flex;*/
  /*      justify-content: space-between;*/
  /*      .iconfont{*/
  /*        font-size: 36px;*/
  /*      }*/
  /*      .tel-list{*/
  /*        display: inline-block;*/
  /*      }*/
  /*    }*/
  /*  }*/
  /*}*/
  .web-head {
    height: 60px;
    background: #BC4343;
    padding: 0 12.5%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    /*min-width: 1260px;*/
    .header-logo {
      width: 250px;
      img {
        width: 100%;
      }
    }
        .header-middle{
          color: #ffffff;
          /*width: 618px;*/
          font-size: 16px;
          /*width: 400px;*/
          height: 60px;
          line-height: 60px;
          .header-bar{
            display: flex;
            box-sizing: border-box;
            height: 100%;
            justify-content: space-between;
            .header-bar-item{
              text-align: center;
              box-sizing: border-box;
              height: 100%;
              margin-right: 30px;
            }
            .activity{
              border-bottom: 2px solid #ffffff;
            }
          }
        }
    .header-tel {
      color: #ffffff;
      display: flex;
      align-items: center;
      .iconphone {
        display: inline-block;
        font-size: 36px;
      }
      .tel-list {
        display: inline-block;
      }
    }
  }
</style>

