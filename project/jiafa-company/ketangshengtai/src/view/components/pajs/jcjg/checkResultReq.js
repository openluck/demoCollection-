const { request } = require("../../../../util/request")

export const getSchoolAreaReq = pr => {
    return request("checkDetail/getSchoolArea", pr)
}

export const getBuildingReq = pr => {
    return request("checkDetail/getBuilding", pr)
}

export const getClassRoomReq = pr => {
    return request("checkDetail/getClassRoom", pr)
}

export const getSafetyEventReq = pr => {
    return request("checkDetail/getSafetyEvent", pr)
}

export const getRecordListReq = pr => {
    return request("checkDetail/getRecordList", pr)
}

export const exportDetailReq = pr => {
    return request("checkDetail/exportDetail", pr)
}

export const getRecordDetailsReq = pr => {
    return request("checkDetail/getRecordDetails", pr)
}

export const getAutoWarnReq = pr => {
    return request("statisticsReport/getAutoWarn", pr)
}

export const getHumanCheckReq = pr => {
    return request("statisticsReport/getHumanCheck", pr)
}
