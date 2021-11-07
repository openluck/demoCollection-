import axios from '../../axios'

//获取变更项统计列表
export const getExeeTypeStaList = (data) => {
  return axios({
    url: "/regInfoStatistics/getExeeTypeStaList",
    method: "post",
    data
  })
}

