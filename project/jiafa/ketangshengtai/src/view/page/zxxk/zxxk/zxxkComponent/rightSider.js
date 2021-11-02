import React from "react";
import { DatePicker, Tree, Spin } from "antd";
import ScrollBar from "react-perfect-scrollbar";
import moment from "moment";
import { disabledEndDate } from "./../format";
import nodata2 from "./../../../../../media/picture/nodata2.png";
import "./../../../../../style/zxxk/zxxk/zxxkComponent/RightSider.scss";
export default function RightSider(props) {
  const { date, tourCourseInfo } = props;
  const {
    handleChangeDate,
    handleCourseTabs,
    setTourCourseInfo,
    handlePlaceSelect,
  } = props;
  return (
    <div className="xm-videobox-right">
      <DatePicker
        className="xm-videobox-right-input"
        bordered={false}
        style={{ width: "100%" }}
        value={moment(date)}
        disabledDate={disabledEndDate}
        onChange={(datemoment, dateString) =>
          handleChangeDate(datemoment, dateString, tourCourseInfo)
        }
      />
      <ul className="xm-videobox-right-tabs">
        <li
          className={tourCourseInfo.courseTabsIndex === 1 ? "active" : ""}
          onClick={() => handleCourseTabs(1)}
        >
          <span>教室查课</span>
          <p></p>
        </li>
        <li
          className={tourCourseInfo.courseTabsIndex === 2 ? "active" : ""}
          onClick={() => handleCourseTabs(2)}
        >
          <span>老师查课</span>
          <p></p>
        </li>
        {/* <li className={courseTabsIndex === 3 ? 'active' : ''} onClick={() => handleCourseTabs(3)}>
      <span>课程查课</span>
      <p></p>
    </li> */}
      </ul>
      <ScrollBar className="xm-videobox-right-treebox">
        {tourCourseInfo.placeLoading ? (
          <div className="xm-videobox-right-loading">
            {" "}
            <Spin size="middle" />
          </div>
        ) : tourCourseInfo.tourCourseList &&
          tourCourseInfo.tourCourseList.length ? (
          <Tree
            className="xm-videobox-right-tree"
            blockNode={true}
            selectedKeys={tourCourseInfo.checkedKeys}
            expandedKeys={tourCourseInfo.expandedKeys}
            onExpand={(expandedKeys) =>
              setTourCourseInfo({ ...tourCourseInfo, expandedKeys })
            }
            onSelect={(checkedKeys, e) => handlePlaceSelect(checkedKeys, e)}
          >
            {tourCourseInfo.tourCourseList}
          </Tree>
        ) : (
          <div className="xm-rightVideo-nodata">
            <img src={nodata2} alt />
            <p>暂无数据</p>
          </div>
        )}
      </ScrollBar>
    </div>
  );
}
