<template>
  <el-carousel :interval="4000" arrow="always" :loop="false" class="rotary " height="320px">
    <el-carousel-item>
      <img src="../../assets/img/Rotation1.png">
      <div class="item_top">
        {{this.$t('rotationChart.start.title')}}
      </div>
      <div class="item_div">
        <div>{{this.$t('rotationChart.start.complete')}}<span>{{this.$t('rotationChart.start.time')}}</span></div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <img src="../../assets/img/Rotation3.png">
      <div class="item_top">
        {{this.$t('rotationChart.register.title')}}
      </div>
      <div class="item_div">
        <div>{{this.$t('rotationChart.register.complete')}}<span>{{this.$t('rotationChart.register.time')}}</span></div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <img src="../../assets/img/Rotation2.png">
      <div class="item_top">
        {{this.$t('rotationChart.access.title')}}
      </div>
      <div class="item_div">
        <div>{{this.$t('rotationChart.access.complete')}}<span>{{this.$t('rotationChart.access.time')}}</span></div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <img src="../../assets/img/Rotation4.png">
      <div class="item_top">
        {{this.$t('rotationChart.warehouse.title')}}
      </div>
      <div class="item_div">
        <div>{{this.$t('rotationChart.warehouse.complete')}}<span>{{this.$t('rotationChart.warehouse.time')}}</span></div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <img src="../../assets/img/Rotation5.png">
      <div class="item_top">
        {{this.$t('rotationChart.choice.title')}}
      </div>
      <div class="item_div">
        <div>{{this.$t('rotationChart.choice.complete')}}<span>{{this.$t('rotationChart.choice.time')}}</span></div>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <img src="../../assets/img/Rotation6.png">
      <div class="item_top">
        {{this.$t('rotationChart.product.title')}}
      </div>
      <div class="item_div">
        <div>{{this.$t('rotationChart.product.complete')}}<span>{{this.$t('rotationChart.product.time')}}</span></div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
    export default {
        name: "RotationChart"
    }
</script>

<style scoped lang="scss">
  .rotary{
   /deep/ .el-carousel__indicators{
      display: none;
    }
    /deep/ .el-carousel__container{
      text-align: center;
      .el-carousel__arrow--left{
        left: 20px;
        font-size: 30px;
        color: #666666;
      }
      .el-carousel__arrow{
        background: transparent;
      }
      .el-carousel__arrow--right{
        right:20px;
        font-size: 30px;
        color: #666666;
      }
      .el-carousel__item{
        img{
          width: 225px;
          height: 244px;
        }
        .item_top{
          width: 225px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          color: white;
          font-size: 16px;
          font-weight: bold;
          background: rgba(0,0,0,0.4);
          margin: auto;
          position: absolute;
          top: 65%;
          left: 50%;
          transform: translateX(-50%);
        }
        .item_div{
          width: 225px;
          margin: auto;
          border: 1px solid #D1CDCD;
          padding: 10px;
          box-sizing: border-box;
          position: relative;
          top: -5px;
          font-size: 14px;
          text-align: left;
          padding-bottom: 18px;
          span{
            font-size: 12px;
            color: #999999;
            float: right;
            margin-top: 4px;
          }
        }
      }
    }
  }
</style>
