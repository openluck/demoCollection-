/*
 * @Author: luolei 
 * @Date: 2021-01-18 14:21:56 
 * @Last Modified by: luolei
 * @Last Modified time: 2021-02-03 12:36:56
 */
const TYPES = {
    MODIFY_ROOM_DETAIL: "MODIFY_ROOM_DETAIL",
};

export const getRoomDetail_action = (roomDetail = {}) => {
    return {
        type:TYPES.MODIFY_ROOM_DETAIL,
        data: roomDetail
    }
}
