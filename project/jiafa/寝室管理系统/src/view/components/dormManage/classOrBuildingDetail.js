import { Tabs, Tag } from "antd"
import React, { } from "react"

export default function ClassOrBuildingDetail({
    title,
    detailData
}) {
    return <div className="ll-classOrBuildingDetail">
        <div className="ll-classOrBuilding-title">
            <div className="ll-blueTitle">
                {title}
            </div>
        </div>
        {
           detailData ?
                <div className="ll-detail-content">
                    {
                       detailData.notSignList?.length > 0 ?
                            <Tag color="red" >未签人员</Tag> : null
                    }
                    {
                       detailData.notSignList?.length > 0 ?
                            <div className="ll-personList">
                                {

                                   detailData?.notSignList?.map((item, index) => {
                                        return <div className="ll-personName" key={index} title={item.name}>
                                            {`${item.name}(${item.amount})`}
                                        </div>
                                    })
                                }
                            </div> : null
                    }
                    {
                       detailData.lateSignList?.length > 0 ?
                            <Tag color="purple" >晚签人员</Tag> : null
                    }
                    {
                       detailData.lateSignList?.length > 0 ?
                            <div className="ll-personList">
                                {

                                   detailData?.lateSignList?.map((item, index) => {
                                        return <div className="ll-personName" key={index} title={item.name}>
                                             {`${item.name}(${item.amount})`}
                                        </div>
                                    })
                                }
                            </div> : null
                    }
                    {
                       detailData.earlySignList?.length > 0 ?
                            <Tag color="orange" >早签人员</Tag> : null
                    }
                    {
                       detailData.earlySignList?.length > 0 ?
                            <div className="ll-personList">
                                {

                                   detailData?.earlySignList?.map((item, index) => {
                                        return <div className="ll-personName" key={index} title={item.name}>
                                             {`${item.name}(${item.amount})`}
                                        </div>
                                    })
                                }
                            </div> : null
                    }
                </div>
                : null
        }
    </div>
}