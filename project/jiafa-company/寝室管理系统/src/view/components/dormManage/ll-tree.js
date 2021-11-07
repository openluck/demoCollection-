import { TreeSelect } from "antd"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import _ from "lodash";

const { TreeNode } = TreeSelect

//type 1班级 2楼栋
export default function OrgTreeSingle({ onChange, type }) {
    const dataSource = getUsefulClassData()

    const data = useSelector(store => type == 2 ? store.buildTree_reducer.buildTree : dataSource)
    const newData = type == 1 || type == 3 ? [{
        gradeName: "全部",
        gradeId: "all",
        classId: "all",
        children: data
    }]
        : [{
            buildName: "全部",
            buildId: "all",
            childrenList: data
        }]
    const [curValue, setCurValue] = useState("all")

    function getUsefulClassData() {
        const classData = useSelector(store => store.classesTree_reducer.list)
        console.log(classData)
        if (classData) {
            let temp = [...classData]
            temp.map(item => {
                item.classId = "all"
                if (item.children) {
                    item.children.map(item2 => {
                        item2.gradeId = item.gradeId
                    })
                }
            })
            return temp
        }
    }

    function filterObj(id) {
        let temp = {}
        if (id == "all") {
            return { gradeId: "all", classId: "all" }
        }
        else {
            // for (let i = 0; i < data.length; i++) {
            //     console.log(id, data[i].gradeId, data[i].classId)
            //     if (data[i].gradeId == id) {
            //         return data[i]
            //     }
            //     else if (data[i].children) {
            //         if (_.filter(data[i].children, { 'classId': id })) {
            //             return _.filter(data[i].children, { 'classId': id })[0]
            //         }
            //         //  data[i].children.map(item => {
            //         //     if(item.classId == id){
            //         //         console.log(item)
            //         //         return item
            //         //     }
            //         // })
            //     }
            // }
            console.log(data)
            data.map(item => {
                if (item.gradeId == id) {
                    temp = item
                }
                else if (item.children) {
                    item.children.map(item2 => {
                        if (item2.classId == id) {
                            temp = item2
                        }
                    })
                }
            })
        }
        return temp
    }

    function createTreeNode(arr, type, name) {
        if (type == 1 || type == 3) {
            return arr.map(item => {
                if (item.children?.length > 0) {
                    return <TreeNode
                        value={item.gradeId}
                        title={item.gradeName}
                        key={item.gradeId}
                    >
                        {
                            item.children.map(item2 => {
                                return <TreeNode
                                    value={item2.gradeId}
                                    title={item2.gradeName}
                                    key={item2.gradeId}
                                >
                                    {
                                        item2.children.map(item3 => {
                                            return <TreeNode
                                                value={item3.classId}
                                                title={item3.className}
                                                key={item3.classId}
                                            />
                                        })
                                    }
                                </TreeNode>
                            })
                        }
                    </TreeNode>
                }
                else {
                    return <TreeNode
                        value={item.gradeId}
                        title={item.gradeName}
                        key={item.gradeId}
                    />
                }
            })
        }
        else {
            return arr.map(item => {
                if (item.childrenList?.length > 0) {
                    let newName = name != "全部" ? name + item.buildName : item.buildName
                    // console.log(item)
                    return <TreeNode
                        value={item.buildId}
                        title={newName}
                        key={item.buildId}
                    >
                        {createTreeNode(item.childrenList, type, newName)}
                    </TreeNode>
                }
                else {
                    return <TreeNode
                        value={item.buildId}
                        title={item.buildName}
                        key={item.buildId}
                    />
                }
            })
        }
    }

    // createTreeNode(data, type, "")

    return <TreeSelect
        style={{ width: 200 }}
        value={curValue}
        onChange={(value, b, c) => {
            console.log(b, c)
            let temp = filterObj(value)
            setCurValue(value)
            let param = (type == 2) ? value : temp
            console.log(param)
            onChange(param)
        }}
    >
        {
            createTreeNode(newData, type, "")
        }
    </TreeSelect>
}