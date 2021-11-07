<template>
  <div class="wyx-doc">
    <div class="doc-title">
      <img
        src="../../assets/doc.png"
        alt=""
      >
    </div>
    <div class="doc-content">
      <h2><i>1.</i>选课活动创建</h2>
      <div class="doc-text">
        1）分班方案是在选课活动之下创建生成的，因此需要先知晓学生的选课活动才能生成不同的分班结果； <br />
        2）可进行系统导入形式或者手动上传形式创建选课活动；<br />
        3）手动上传选课活动，可选择上传无人员名单的选课结果；只需要在表格中确定组合选择人数即可；</div>
      <div style="display:flex; ">
        <div class="doc-img">
          <img
            src="../../assets/doc_img/1-1.png"
            alt=""
          >
          <p>图1-1</p>
        </div>
        <div class="doc-img">
          <img
            src="../../assets/doc_img/1-2.png"
            alt=""
          >
          <p>图1-2</p>
        </div>
      </div>

      <h2><i>2.</i>创建分组</h2>
      <div class="doc-text">
        1）点击添加分组可将学生进行分层分班；<br />
        <div class="doc-img">
          <img
            src="../../assets/doc_img/2-1.png"
            alt=""
          >
          <p>图2-1</p>
        </div>
        2）在无人员名单的时候，可直接输入数字将学生进行分层；<br />
        3）存在具体的人员名单的时候则选择具体的人员进行分层<br />
        <div class="doc-img">
          <img
            src="../../assets/doc_img/2-2.png"
            alt=""
            style="width:50%;"
          >
          <p>图2-2</p>
        </div>
        4）可按照成绩进行人员筛选也可直接输入人数系统随机拉取学生进入该层级内；<br />
        5）可对已创建的分层进行删除操作，删除后已创建好的分层会重新回到A组中
      </div>
      <div class="doc-img">
        <img
          src="../../assets/doc_img/2-3.png"
          alt=""
          style="width:50%;"
        >
        <p>图2-3</p>
      </div>

      <h2><i>3.</i>行政班级创建</h2>
      <div class="doc-text">
        1）点击新增行政班级，需要对进入该行政班级的组合人员进行确定；A组内的选考组合人数，随着进行行政班级组合的人数而减少；最后组内的选考组合人数为0时，则表示该组内的人员已全部分班完成；<br />
        2）有人员名单时：<br />
        i.对组合下人员进行选择，可多选人员；由用户自行选择哪些人员进入该班级；<br />
        ii.当输入人数的时候，则该人员不可单独进行选择，直接系统随机拉入等量的学生进入该班级；
        <div style="display:flex; ">
          <div class="doc-img">
            <img
              src="../../assets/doc_img/3-1.png"
              alt=""
              style="margin-top:22.5%;"
            >
            <p>图3-1</p>
          </div>
          <div class="doc-img">
            <img
              src="../../assets/doc_img/3-2.png"
              alt=""
            >
            <p>图3-2</p>
          </div>
        </div>
        iii.针对组合进行人员选择，点击“选择人员”跳转至组合人员的勾选，可勾选多个，翻页后勾选数据保留；<br />
        iv.人员选择点击“确定”则回到组合页面，选择人员总数计算显示在组合进入人数中；<br />
        v.进入行政班组合选择时，默认组合进入人数为0；<br />
        vi.可学生姓名进行精确查找；<br />
        1）无人员名单时：<br />
        i.在无人员名单下，对组合下人数进行选择，选择进入该行政班级的组合人数多少；<br />
        <div class="doc-img">
          <img
            src="../../assets/doc_img/3-3.png"
            alt=""
            style="width:50%;"
          >
          <p>图3-3</p>
        </div>
        ii.勾选需要进入班级的组合，选择进入班级组合的人数；<br />
        2）创建完成行政班，显示进入了该行政班下的组合及人数，自动为该行政班级生成对应的教学班；<br />
        3）新建行政班按数字顺序进行自动命名；教学班命名规则同行政班一直；当为行政1班时，教学班为，xx教学1班；<br />
        4）对创建好的行政班级可进行删除，删除后与该行政班下关联的教学班级关系一并被删除；删除行政班级后，如该行政班为行政1班，删除后则无行政1班，班级不进行数字升级；再次新建班级则新建班级名称为行政1班；<br />
        5）删除时进行二次确认：删除后，该班级下的教学班级数据同步被删除；<br />
        6）删除班级后，A组内的选考组合人数变更为该组进入行政班之前的人数；<br />
        7）当组内的选考组合人数剩余为0时，则表示该组内的人员已全部完成分班；<br />
      </div>

      <h2><i>4.</i>教学班搭班</h2>
      <div class="doc-text">
        1）创建行政班级后，该行政班内对应生成教学班；教学班命名方式跟随行政班命名方式；<br />
        2）可对教学班进行合并操作：<br />
        3）点击教学班的合并班级按钮，将该教学班与可其他教学班进行合并，如：地理教学1班，点击合并班级按钮，查找出所有已完成分班的地理教学班级，选择进入该地理教学班的人数，合并完成后，行政1班显示地理教学2班，表示该行政班学生在上地理课时与地理教学2班的人一同上课；<br />
        4）合并的教学班显示自己原本班级人数及合并过来的人数；
        <div class="doc-img">
          <img
            src="../../assets/doc_img/4-1.png"
            alt=""
            style="width:50%;"
          >
          <p>图4-1</p>
        </div>
        5）合并教学班时，选择合并教学班下组合的人员出去进行合并：列如：地理教学1班的15人需要出去合并，则地理教学1班的地理人员存在，物化地组合和物政地组合，需要人为确认哪个组合的人员进入地理教学2班或3班；<br />
        6）进行教学班级合并时，合并人员可进行夸组合教学班合并；<br />
        7）合并班级选择进行合并后，被合并的的班级可选择取消合并班级；取消后，合并过去的人重新回到该教学班内；（例如：地理教学1班有15人合并到了地理教学2班去，则在行政1班下生成一个地理教学2班显示合并的人数存在取消合并按钮）<br />
        8）当行政班下的教学班所有人员都与其他教学班进行合并后，该行政班下的所属教学班则不存在；<br />
        9）合并教学班时，教学1班人都可与教学2班合并，但教学2班的人不可再出去与其他教学班合并；<br />
        10）取消合并教学班，则该教学班走出去的人员回到该教学班；如遇行政1班下教学1班的人都走出去了，则无教学1班人员，点击走出去的人员取消合并班级，则教学1班重新出现；<br />
        11）合并教学班人员数时，可以其他组班级人员进行合并；<br />
        12）在被合并的教学班中显示原本本教学班的人数和其他教学班来源人数；<br />
        13）如该方案为有人员名单分班则可查看教学班的具体人员名单：
        <div class="doc-img">
          <img
            src="../../assets/doc_img/4-2.png"
            alt=""
            style="width:50%;"
          >
          <p>图4-2</p>
        </div>
        14）教学班搜索，学生姓名为精确搜索：<br />
        15）显示该行政班级下总人数和男女各多少人员<br />
        16）点击行政班级，可查看该行政班下的所有学生人员名单；如分班时无具体的人员名单，则该“查看人员名单”为置灰状态；<br />
        17）导入班级模板<br />
        <div class="doc-img">
          <img
            src="../../assets/doc_img/4-3.png"
            alt=""
          >
          <p>图4-3</p>
        </div>
        18）如该方案为有人员名单分班则查看行政班级人员名单<br />
        <div class="doc-img">
          <img
            src="../../assets/doc_img/4-4.png"
            alt=""
            style="width:50%;"
          >
          <p>图4-4</p>
        </div>
      </div>

      <h2><i>5.</i>检测自动分班</h2>
      <div class="doc-text">
        1）检测所有学生是否完成分班，当检测到分组下所有组合都为0时表示该分班动作完成，可进行学考分班或发布方案；<br />
        <div class="doc-img">
          <img
            src="../../assets/doc_img/5-1.png"
            alt=""
            style="display:block;width:50%;"
          >
          <p>图5-1</p>
        </div>
        1）当所有学生都完成分班后，系统进行校验该方案在无任何规则下是否可以成功排课；<br />
        2）当检测到存在人员未完成分班，则该方案无法发布，需要继续手动或自动分班；点击手动；点击自动对剩余未分配人员进行自动分班；<br />
      </div>

      <h2><i>6.</i>方案对比</h2>
      <div class="doc-text">
        1）选择一个分班方案或多个分班方案进行对比，最多只可选择三个方案；只可对已完成的分班方案进行对比<br />
        2）对各个分班方案下的班级数量，学科教师占比，学生走动率进行对比；<br />
        3）完成后可对一个分班方案进行发布；<br />
        <div class="doc-img">
          <img
            src="../../assets/doc_img/6-1.png"
            alt=""
          >
          <p>图6-1</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="less">
.wyx-doc {
  height: 100%;
  width: 100%;
  .doc-title {
    // height: 100px;
    width: 100%;
  }
  .doc-content {
    width: 70%;
    margin: 0 auto;
    // background-color: #ddd;
    .doc-img {
      width: 100%;
      margin: 0 auto;
      img {
        width: 100%;
        display: block;
        // height: 70%;
        // height: 500px;
        margin: 15px auto;
      }
    }
  }
  h2 {
    font-size: 35px;
    margin: 15px 0;
  }
  .doc-text {
    font-size: 20px;
    color: #000;
  }
  p {
    font-size: 18px;
    text-align: center;
  }
  i {
    font-style: normal;
    color: #3370ff;
  }
}
</style>