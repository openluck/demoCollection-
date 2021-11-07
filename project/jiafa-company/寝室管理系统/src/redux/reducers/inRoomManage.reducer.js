/*
 * @Author: luolei 
 * @Date: 2021-01-18 14:29:34 
 * @Last Modified by: luolei
 * @Last Modified time: 2021-02-03 11:09:45
 */
const defautRoomDetail = {
    morningState: {
        notSignList: [
            {
                name: "non do",
                amount: 45
            },
            {
                name: "voluptate",
                amount: 315
            }
        ],
        earlySignList: [
            {
                name: "id cons",
                amount: 77
            },
            {
                name: "dolor",
                amount: 7504
            },
            {
                name: "ex mollit",
                amount: 139
            },
            {
                name: "Ut culpa sed reprehenderit dolor",
                amount: 34
            }
        ],
        lateSignList: [
            {
                name: "adipisicing labor",
                amount: 88
            },
            {
                name: "sit",
                amount: 85
            },
            {
                name: "et laborum sint Excepteur",
                amount: 11
            },
            {
                name: "deserunt consectetur pariatur in aliquip",
                amount: 8
            },
            {
                name: "eu veniam Lorem Ut nisi",
                amount: -64
            }
        ]
    },
    nightState: {},
    afternoonState: {}
}
export const detailData_reducer = (state = defautRoomDetail, { type, data }) => {
    switch (type) {
        case "MODIFY_ROOM_DETAIL": {
            return { ...data }
        }
        default: {
            return state
        }
    }
}