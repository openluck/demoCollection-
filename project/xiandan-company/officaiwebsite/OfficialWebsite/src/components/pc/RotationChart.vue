<template>
  <div class="rotation-chart">
    <el-carousel :interval="4000" type="card" height="360px">
      <el-carousel-item>
        <div class="item_div" >
          <div><span>{{this.$t('rotationChart.start.title')}}</span><span style="color: white">{{this.$t('rotationChart.start.time')}}</span></div>
          <div>{{this.$t('rotationChart.start.complete')}}</div>
        </div>
        <img src="../../assets/img/Rotation1.png">
      </el-carousel-item>
      <el-carousel-item>
        <div class="item_div">
          <div><span style="color: white">{{this.$t('rotationChart.register.title')}}</span><span style="color: white">{{this.$t('rotationChart.register.time')}}.01</span></div>
          <div>{{this.$t('rotationChart.register.complete')}}</div>
        </div>
        <img src="../../assets/img/Rotation3.png">
      </el-carousel-item>
      <el-carousel-item>
        <div class="item_div" >
          <div><span style="color: white">{{this.$t('rotationChart.access.title')}}</span><span style="color: white">{{this.$t('rotationChart.access.time')}}</span></div>
          <div>{{this.$t('rotationChart.access.complete')}}</div>
        </div>
        <img src="../../assets/img/Rotation2.png">
      </el-carousel-item>
      <el-carousel-item>
        <div class="item_div" >
          <div><span>{{this.$t('rotationChart.warehouse.title')}}</span><span>{{this.$t('rotationChart.warehouse.time')}}</span></div>
          <div>{{this.$t('rotationChart.warehouse.complete')}}</div>
        </div>
        <img src="../../assets/img/Rotation4.png">
      </el-carousel-item>
      <el-carousel-item>
        <div class="item_div" >
          <div><span>{{this.$t('rotationChart.choice.title')}}</span><span>{{this.$t('rotationChart.choice.time')}}</span></div>
          <div>{{this.$t('rotationChart.choice.complete')}}</div>
        </div>
        <img src="../../assets/img/Rotation5.png">
      </el-carousel-item>
      <el-carousel-item>
        <div class="item_div" >
          <div><span>{{this.$t('rotationChart.product.title')}}</span><span >{{this.$t('rotationChart.product.time')}}</span></div>
          <div>{{this.$t('rotationChart.product.complete')}}</div>
        </div>
        <img src="../../assets/img/Rotation6.png">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
    export default {
      name: "RotationChart"
    }
</script>

<style scoped lang="scss">
  .rotation-chart{
    width: calc(100% - 440px);
    margin: auto;
  }
  .el-carousel__item{
    text-align: center;
    .item_div{
      text-align: left;
      background-color: white;
      width: 350px;
      height: 100px;
      line-height: 100px;
      border: 1px dotted #D1CDCD;
      margin: auto;
      box-sizing: border-box;
      padding: 20px;
      &>div:nth-of-type(1){
        height: 20px;
        margin-top: -40px;
        position: relative;
        span:nth-of-type(1){
          font-size: 18px;
          color: #212121;
          font-weight: bold;
        }
        span:nth-of-type(2){
          color: #666666;
          font-size: 14px;
          position: absolute;
          right: 0px;
        }
      }
      &>div:nth-of-type(2){
        height: 20px;
        color: #333333;
        font-size: 14px;
        margin-top: 16px;
      }
    }
  }
  .el-carousel__item:nth-of-type(2), .el-carousel__item:nth-of-type(3){
    .item_div{
      position: absolute;
      bottom: 0px;
      left: 50%;
      transform: translateX(-50%);
      background:rgba(51,51,51,0.5);
      border: none;
      div{
        color: white;
      }
    }
  }
</style>
