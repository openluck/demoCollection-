const list = [
  {
    id: '0',
    diffNoon: "上午",
    lesMon: {
      lesId: "1001",
      lesPlace: "701",
      lesSub: "语文",
      stuNum: "120",
      lesTeacher: "李老师",
      lesSort: "第一节",
      dateDay: "3月5日",
      weekday: "星期一",
      isHoliday: false,
      isCancel: false,
      startTime: '09:00',
      endTime: '10:00'
    },
    lesType: "正常",
    lesSort: "第一节",
    lesTue: {
      lesId: "10010",
      lesPlace: "701",
      lesSub: "数学",
      stuNum: "100",
      lesTeacher: "刘老师",
      lesSort: "第一节",
      dateDay: "3月6日",
      weekday: "星期二",
      isHoliday: false,
      isCancel: true,
      startTime: '09:00',
      endTime: '10:00'
    },
    lesWed: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月7日",
      weekday: "星期三",
      isHoliday: false,
      isCancel: false,
      startTime: '09:00',
      endTime: '10:00'
    },
    lesThu: {
      lesId: "10011",
      lesPlace: "701",
      lesSub: "英语",
      stuNum: "150",
      lesTeacher: "陈老师",
      lesSort: "第一节",
      dateDay: "3月8日",
      weekday: "星期四",
      isHoliday: false,
      isCancel: true,
      startTime: '09:00',
      endTime: '10:00'
    },
    lesFri: {
      lesId: "10011112",
      lesPlace: "701",
      lesSub: "化学",
      stuNum: "70",
      lesTeacher: "周老师",
      lesSort: "第一节",
      dateDay: "3月9日",
      weekday: "星期五",
      isHoliday: false,
      isCancel: false,
      startTime: '09:00',
      endTime: '10:00'
    },
    lesSat: {
      lesId: "1001111",
      lesPlace: "701",
      lesSub: "生物",
      stuNum: "70",
      lesTeacher: "孙老师",
      lesSort: "第一节",
      dateDay: "3月10日",
      weekday: "星期六",
      isHoliday: true,
      isCancel: false,
      startTime: '09:00',
      endTime: '10:00'
    },
    lesSun: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月11日",
      weekday: "星期日",
      isHoliday: true,
      isCancel: false,
      startTime: '09:00',
      endTime: '10:00'
    },
  },
  {
    id: '1',
    diffNoon: "上午",
    lesMon: {
      lesId: "101f01",
      lesPlace: "701",
      lesSub: "语文",
      stuNum: "120",
      lesTeacher: "李老师",
      lesSort: "第一节",
      dateDay: "3月5日",
      weekday: "星期一",
      isHoliday: false,
      isCancel: false,
      startTime: '10:00',
      endTime: '10:30'
    },
    lesType: "正常",
    lesSort: "第二节",
    lesTue: {
      lesId: "10cs010",
      lesPlace: "701",
      lesSub: "数学",
      stuNum: "100",
      lesTeacher: "刘老师",
      lesSort: "第一节",
      dateDay: "3月6日",
      weekday: "星期二",
      isHoliday: false,
      isCancel: false,
      startTime: '10:00',
      endTime: '10:30'
    },
    lesWed: {
      lesId: "100dq111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月7日",
      weekday: "星期三",
      isHoliday: false,
      isCancel: false,
      startTime: '10:00',
      endTime: '10:30'
    },
    lesThu: {
      lesId: "10d2011",
      lesPlace: "701",
      lesSub: "英语",
      stuNum: "150",
      lesTeacher: "陈老师",
      lesSort: "第一节",
      dateDay: "3月8日",
      weekday: "星期四",
      isHoliday: false,
      isCancel: false,
      startTime: '10:00',
      endTime: '10:30'
    },
    lesFri: {
      lesId: "100da11112",
      lesPlace: "701",
      lesSub: "化学",
      stuNum: "70",
      lesTeacher: "周老师",
      lesSort: "第一节",
      dateDay: "3月9日",
      weekday: "星期五",
      isHoliday: false,
      isCancel: false,
      startTime: '10:00',
      endTime: '10:30'
    },
    lesSat: {
      lesId: "1001gd111",
      lesPlace: "701",
      lesSub: "生物",
      stuNum: "70",
      lesTeacher: "孙老师",
      lesSort: "第一节",
      dateDay: "3月10日",
      weekday: "星期六",
      isHoliday: true,
      isCancel: false,
      startTime: '10:00',
      endTime: '10:30'
    },
    lesSun: {
      lesId: "100vd111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月11日",
      weekday: "星期日",
      isHoliday: true,
      isCancel: false,
      startTime: '10:00',
      endTime: '10:30'
    },
  },
  {
    id: '2',
    diffNoon: "早自习",
    lesMon: {
      lesId: "102v01",
      lesPlace: "701",
      lesSub: "语文",
      stuNum: "120",
      lesTeacher: "李老师",
      lesSort: "第一节",
      dateDay: "3月5日",
      weekday: "星期一",
      isHoliday: false,
      isCancel: false,
      startTime: '10:30',
      endTime: '11:00'
    },
    lesType: "正常",
    lesSort: "第三节",
    lesTue: {
      lesId: "10fs10",
      lesPlace: "701",
      lesSub: "数学",
      stuNum: "100",
      lesTeacher: "刘老师",
      lesSort: "第一节",
      dateDay: "3月6日",
      weekday: "星期二",
      isHoliday: false,
      isCancel: false,
      startTime: '10:30',
      endTime: '11:00'
    },
    lesWed: {
      lesId: "1001fs11",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月7日",
      weekday: "星期三",
      isHoliday: false,
      isCancel: false,
      startTime: '10:30',
      endTime: '11:00'
    },
    lesThu: {
      lesId: "100gd11",
      lesPlace: "701",
      lesSub: "英语",
      stuNum: "150",
      lesTeacher: "陈老师",
      lesSort: "第一节",
      dateDay: "3月8日",
      weekday: "星期四",
      isHoliday: false,
      isCancel: false,
      startTime: '10:30',
      endTime: '11:00'
    },
    lesFri: {
      lesId: "1001nng1112",
      lesPlace: "701",
      lesSub: "化学",
      stuNum: "70",
      lesTeacher: "周老师",
      lesSort: "第一节",
      dateDay: "3月9日",
      weekday: "星期五",
      isHoliday: false,
      isCancel: false,
      startTime: '10:30',
      endTime: '11:00'
    },
    lesSat: {
      lesId: "100vf1111",
      lesPlace: "701",
      lesSub: "生物",
      stuNum: "70",
      lesTeacher: "孙老师",
      lesSort: "第一节",
      dateDay: "3月10日",
      weekday: "星期六",
      isHoliday: true,
      isCancel: false,
      startTime: '10:30',
      endTime: '11:00'
    },
    lesSun: {
      lesId: "100bd111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月11日",
      weekday: "星期日",
      isHoliday: true,
      isCancel: false,
      startTime: '10:30',
      endTime: '11:00'
    },
  },
  {
    id: '3',
    diffNoon: "上午",
    lesMon: {
      lesId: "1001",
      lesPlace: "701",
      lesSub: "语文",
      stuNum: "120",
      lesTeacher: "李老师",
      lesSort: "第一节",
      dateDay: "3月5日",
      weekday: "星期一",
      isHoliday: false,
      isCancel: false,
      startTime: '11:00',
      endTime: '12:00'
    },
    lesType: "正常",
    lesSort: "第四节",
    lesTue: {
      lesId: "10010",
      lesPlace: "701",
      lesSub: "数学",
      stuNum: "100",
      lesTeacher: "刘老师",
      lesSort: "第一节",
      dateDay: "3月6日",
      weekday: "星期二",
      isHoliday: false,
      isCancel: false,
      startTime: '11:00',
      endTime: '12:00'
    },
    lesWed: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月7日",
      weekday: "星期三",
      isHoliday: false,
      isCancel: false,
      startTime: '11:00',
      endTime: '12:00'
    },
    lesThu: {
      lesId: "10011",
      lesPlace: "701",
      lesSub: "英语",
      stuNum: "150",
      lesTeacher: "陈老师",
      lesSort: "第一节",
      dateDay: "3月8日",
      weekday: "星期四",
      isHoliday: false,
      isCancel: false,
      startTime: '11:00',
      endTime: '12:00'
    },
    lesFri: {
      lesId: "10011112",
      lesPlace: "701",
      lesSub: "化学",
      stuNum: "70",
      lesTeacher: "周老师",
      lesSort: "第一节",
      dateDay: "3月9日",
      weekday: "星期五",
      isHoliday: false,
      isCancel: false,
      startTime: '11:00',
      endTime: '12:00'
    },
    lesSat: {
      lesId: "1001111",
      lesPlace: "701",
      lesSub: "生物",
      stuNum: "70",
      lesTeacher: "孙老师",
      lesSort: "第一节",
      dateDay: "3月10日",
      weekday: "星期六",
      isHoliday: true,
      isCancel: false,
      startTime: '11:00',
      endTime: '12:00'
    },
    lesSun: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月11日",
      weekday: "星期日",
      isHoliday: true,
      isCancel: false,
      startTime: '11:00',
      endTime: '12:00'
    },
  },
  {
    id: '4',
    diffNoon: "下午",
    lesMon: {
      lesId: "1001",
      lesPlace: "701",
      lesSub: "语文",
      stuNum: "120",
      lesTeacher: "李老师",
      lesSort: "第一节",
      dateDay: "3月5日",
      weekday: "星期一",
      isHoliday: false,
      isCancel: false,
      startTime: '14:00',
      endTime: '15:00'
    },
    lesType: "正常",
    lesSort: "第六节",
    lesTue: {
      lesId: "10010",
      lesPlace: "701",
      lesSub: "数学",
      stuNum: "100",
      lesTeacher: "刘老师",
      lesSort: "第一节",
      dateDay: "3月6日",
      weekday: "星期二",
      isHoliday: false,
      isCancel: false,
      startTime: '14:00',
      endTime: '15:00'
    },
    lesWed: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月7日",
      weekday: "星期三",
      isHoliday: false,
      isCancel: false,
      startTime: '14:00',
      endTime: '15:00'
    },
    lesThu: {
      lesId: "10011",
      lesPlace: "701",
      lesSub: "英语",
      stuNum: "150",
      lesTeacher: "陈老师",
      lesSort: "第一节",
      dateDay: "3月8日",
      weekday: "星期四",
      isHoliday: false,
      isCancel: false,
      startTime: '14:00',
      endTime: '15:00'
    },
    lesFri: {
      lesId: "10011112",
      lesPlace: "701",
      lesSub: "化学",
      stuNum: "70",
      lesTeacher: "周老师",
      lesSort: "第一节",
      dateDay: "3月9日",
      weekday: "星期五",
      isHoliday: false,
      isCancel: false,
      startTime: '14:00',
      endTime: '15:00'
    },
    lesSat: {
      lesId: "1001111",
      lesPlace: "701",
      lesSub: "生物",
      stuNum: "70",
      lesTeacher: "孙老师",
      lesSort: "第一节",
      dateDay: "3月10日",
      weekday: "星期六",
      isHoliday: true,
      isCancel: false,
      startTime: '14:00',
      endTime: '15:00'
    },
    lesSun: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月11日",
      weekday: "星期日",
      isHoliday: true,
      isCancel: false,
      startTime: '14:00',
      endTime: '15:00'
    },
  },
  {
    id: '5',
    diffNoon: "下午",
    lesMon: {
      lesId: "1001",
      lesPlace: "701",
      lesSub: "语文",
      stuNum: "120",
      lesTeacher: "李老师",
      lesSort: "第一节",
      dateDay: "3月5日",
      weekday: "星期一",
      isHoliday: false,
      isCancel: false,
      startTime: '15:00',
      endTime: '16:00'
    },
    lesType: "正常",
    lesSort: "第七节",
    lesTue: {
      lesId: "10010",
      lesPlace: "701",
      lesSub: "数学",
      stuNum: "100",
      lesTeacher: "刘老师",
      lesSort: "第一节",
      dateDay: "3月6日",
      weekday: "星期二",
      isHoliday: false,
      isCancel: false,
      startTime: '15:00',
      endTime: '16:00'
    },
    lesWed: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月7日",
      weekday: "星期三",
      isHoliday: false,
      isCancel: false,
      startTime: '15:00',
      endTime: '16:00'
    },
    lesThu: {
      lesId: "10011",
      lesPlace: "701",
      lesSub: "英语",
      stuNum: "150",
      lesTeacher: "陈老师",
      lesSort: "第一节",
      dateDay: "3月8日",
      weekday: "星期四",
      isHoliday: false,
      isCancel: false,
      startTime: '15:00',
      endTime: '16:00'
    },
    lesFri: {
      lesId: "10011112",
      lesPlace: "701",
      lesSub: "化学",
      stuNum: "70",
      lesTeacher: "周老师",
      lesSort: "第一节",
      dateDay: "3月9日",
      weekday: "星期五",
      isHoliday: false,
      isCancel: false,
      startTime: '15:00',
      endTime: '16:00'
    },
    lesSat: {
      lesId: "1001111",
      lesPlace: "701",
      lesSub: "生物",
      stuNum: "70",
      lesTeacher: "孙老师",
      lesSort: "第一节",
      dateDay: "3月10日",
      weekday: "星期六",
      isHoliday: true,
      isCancel: false,
      startTime: '15:00',
      endTime: '16:00'
    },
    lesSun: {
      lesId: "100111",
      lesPlace: "701",
      lesSub: "物理",
      stuNum: "1400",
      lesTeacher: "赵老师",
      lesSort: "第一节",
      dateDay: "3月11日",
      weekday: "星期日",
      isHoliday: true,
      isCancel: false,
      startTime: '15:00',
      endTime: '16:00'
    },
  },
];

const treeData = [
  {
    placeCode:"0",
    placeName:"成都市第七中学",
    placeType:"1",
    parentCode:"",
    children:[
      {
        placeCode:"0-1",
        placeName:"1栋教学楼",
        placeType:"2",
        parentCode:"0",
        children:[
          {
            placeCode:"0-1-0",
            placeName:"一楼",
            placeType:"3",
            parentCode:"0-1",
            children:[
              {
                placeCode:"0-1-0-1",
                placeName:"1-101",
                placeType:"4",
                parentCode:"0-1-0",
              },
              {
                placeCode:"0-1-0-2",
                placeName:"1-102",
                placeType:"4",
                parentCode:"0-1-0",
              },
              {
                placeCode:"0-1-0-3",
                placeName:"1-103",
                placeType:"4",
                parentCode:"0-1-0",
              }
            ]
          },
          {
            placeCode:"0-1-1",
            placeName:"二楼",
            placeType:"3",
            parentCode:"0-1",
            children:[
              {
                placeCode:"0-1-1-1",
                placeName:"2-101",
                placeType:"4",
                parentCode:"0-1-1",
              },
              {
                placeCode:"0-1-1-2",
                placeName:"2-102",
                placeType:"4",
                parentCode:"0-1-1",
              },
              {
                placeCode:"0-1-1-3",
                placeName:"2-103",
                placeType:"4",
                parentCode:"0-1-1",
              }
            ]
          },
          {
            placeCode:"0-1-2",
            placeName:"三楼",
            placeType:"3",
            parentCode:"0-1",
            children:[
              {
                placeCode:"0-1-2-1",
                placeName:"2-101",
                placeType:"4",
                parentCode:"0-1-2",
              },
              {
                placeCode:"0-1-2-2",
                placeName:"2-102",
                placeType:"4",
                parentCode:"0-1-2",
              },
              {
                placeCode:"0-1-2-3",
                placeName:"2-103",
                placeType:"4",
                parentCode:"0-1-2",
              },{
                placeCode:"0-1-2-4",
                placeName:"2-104",
                placeType:"4",
                parentCode:"0-1-2",
              }
            ]
          }
        ]
      },
      {
        placeCode:"0-2",
        placeName:"2栋教学楼",
        placeType:"2",
        parentCode:"0",
        children:[
          {
            placeCode:"0-2-0",
            placeName:"一楼",
            placeType:"3",
            parentCode:"0-2",
            children:[
              {
                placeCode:"0-2-0-1",
                placeName:"1-101",
                placeType:"4",
                parentCode:"0-2-0",
              },
              {
                placeCode:"0-2-0-2",
                placeName:"1-102",
                placeType:"4",
                parentCode:"0-2-0",
              },
              {
                placeCode:"0-2-0-3",
                placeName:"1-103",
                placeType:"4",
                parentCode:"0-2-0",
              }
            ]
          },
          {
            placeCode:"0-2-1",
            placeName:"二楼",
            placeType:"3",
            parentCode:"0-2",
            children:[
              {
                placeCode:"0-2-1-1",
                placeName:"2-101",
                placeType:"4",
                parentCode:"0-2-1",
              },
              {
                placeCode:"0-2-1-2",
                placeName:"2-102",
                placeType:"4",
                parentCode:"0-2-1",
              },
              {
                placeCode:"0-2-1-3",
                placeName:"2-103",
                placeType:"4",
                parentCode:"0-2-1",
              }
            ]
          },
          {
            placeCode:"0-2-2",
            placeName:"三楼",
            placeType:"3",
            parentCode:"0-2",
            children:[
              {
                placeCode:"0-2-2-1",
                placeName:"2-101",
                placeType:"4",
                parentCode:"0-2-2",
              },
              {
                placeCode:"0-2-2-2",
                placeName:"2-102",
                placeType:"4",
                parentCode:"0-2-2",
              },
              {
                placeCode:"0-2-2-3",
                placeName:"2-103",
                placeType:"4",
                parentCode:"0-2-2",
              }
            ]
          }
        ]
      },
    ]
  }
]
export {
  list,
  treeData
};