import { request } from "../util/request";
import { message } from 'antd';
//考勤
export const getSchTeaAtten = (params) => {
    return request('api/image/getSchTeaAtten', params);
}

export const getSchAttenAna = (params) => {
    return request('api/image/getSchAttenAna', params);
}

export const getSchAttenTrend = (params) => {
    return request('api/image/getSchAttenTrend', params);
}

export const getSchAttenTea = (params) => {
    return request('api/image/getSchAttenTea', params);
}

export const getSchAttenCour = (params) => {
    return request('api/image/getSchAttenCour', params);
}

//到课率，就座率，低头率，违纪率基础信息接口
export const getDjswInfo = (type, params) => {
    switch (type) {
        case 'dkl':
            return request('api/image/getSchToClass', params);
            break;
        case 'jzl':
            return request('api/image/getSchSea', params);
            break;
        case 'sjl':
            return request('api/image/getSchSleep', params);
            break;
        case 'ktwj':
            return request('api/image/getSchClassDis', params);
            break;
        default:
            return false
    }
}

//到课率，就座率，低头率，违纪率开课单位对比分析接口
export const getDjswDbfx = (type, params) => {
    switch (type) {
        case 'dkl':
            return request('api/image/getSchToClassAna', params);
            break;
        case 'jzl':
            return request('api/image/getSchSeaAna', params);
            break;
        case 'sjl':
            return request('api/image/getSchSleepAna', params);
            break;
        case 'ktwj':
            return request('api/image/getSchClassDisAna', params);
            break;
        default:
            return false
    }
}

//到课率，就座率，低头率，违纪率趋势接口
export const getDjswQs = (type, params) => {
    switch (type) {
        case 'dkl':
            return request('api/image/getSchToClassTrend', params);
            break;
        case 'jzl':
            return request('api/image/getSchSeaTrend', params);
            break;
        case 'sjl':
            return request('api/image/getSchSleepTrend', params);
            break;
        case 'ktwj':
            return request('api/image/getSchClassDisTrend', params);
            break;
        default:
            return false
    }
}

//到课率，就座率，低头率，违纪率红黑榜课程接口
export const getDjswHhKc = (type, params) => {
    switch (type) {
        case 'dkl':
            return request('api/image/getSchToClassCour', params);
            break;
        case 'jzl':
            return request('api/image/getSchSeaCource', params);
            break;
        case 'sjl':
            return request('api/image/getSchSleepCour', params);
            break;
        case 'ktwj':
            return request('api/image/getSchClassDisCour', params);
            break;
        default:
            return false
    }
}

//到课率，就座率，低头率，违纪率红黑榜教师接口
export const getDjswHhJs = (type, params) => {
    switch (type) {
        case 'dkl':
            return request('api/image/getSchToClassTea', params);
            break;
        case 'jzl':
            return request('api/image/getSchSeaTea', params);
            break;
        case 'sjl':
            return request('api/image/getSchSleepTea', params);
            break;
        case 'ktwj':
            return request('api/image/getSchClassDisTea', params);
            break;
        default:
            return false
    }
}

//教学分析
export const getSchBehPie = (params) => {
    return request('api/image/getSchBehPie', params);
}

export const getSchDesPie = (params) => {
    return request('api/image/getSchDesPie', params);
}

export const getSchTypePie = (params) => {
    return request('api/image/getSchTypePie', params);
}

export const getSchBehLine = (params) => {
    return request('api/image/getSchBehLine', params);
}

export const getSchDesLine = (params) => {
    return request('api/image/getSchDesLine', params);
}

export const getSchTypeLine = (params) => {
    return request('api/image/getSchTypeLine', params);
}

//听讲反馈
export const getSchStuBehPie = (params) => {
    return request('api/image/getSchStuBehPie', params);
}

export const getSchStuFacPie = (params) => {
    return request('api/image/getSchStuFacPie', params);
}

export const getSchStuZhRade = (params) => {
    return request('api/image/getSchStuZhRade', params);
}

export const getSchStuBehLine = (params) => {
    return request('api/image/getSchStuBehLine', params);
}

export const getSchStuFacLine = (params) => {
    return request('api/image/getSchStuFacLine', params);
}

export const getSchStuZhLine = (params) => {
    return request('api/image/getSchStuZhLine', params);
}
//课堂互动
export const getSchClassActive = (params) => {
    return request('api/image/getSchClassActive', params);
}
export const getSchActiveAna = (params) => {
    return request('api/image/getSchActiveAna', params);
}
export const getSchActiveTrend = (params) => {
    return request('api/image/getSchActiveTrend', params);
}
export const getSchActiveTea = (params) => {
    return request('api/image/getSchActiveTea', params);
}
export const getSchActiveCour = (params) => {
    return request('api/image/getSchActiveCour', params);
}

//教室情况
export const getSchRoomSituation = (params) => {
    return request('api/image/getSchRoomSituation', params);
}

//多媒体
export const getSchMedia = (params) => {
    return request('api/image/getSchMedia', params);
}
export const getSchMediaAna = (params) => {
    return request('api/image/getSchMediaAna', params);
}
export const getSchMediaTrend = (params) => {
    return request('api/image/getSchMediaTrend', params);
}
export const getSchMediaTea = (params) => {
    return request('api/image/getSchMediaTea', params);
}
export const getSchMediaCour = (params) => {
    return request('api/image/getSchMediaCour', params);
}
