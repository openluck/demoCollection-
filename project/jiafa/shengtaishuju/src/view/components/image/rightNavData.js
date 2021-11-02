let navList = {
  //学校画像右侧菜单数据
  organNavData: [
    {
      name: "基本信息",
      id: "jbxx",
      level: "1"
    }, {
      name: "教学秩序",
      id: "jxzx",
      level: "1"
    }, {
      name: "教师考勤",
      id: "jskq",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "到课率",
      id: "dkl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "前排就座率",
      id: "qpjzl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "低头率",
      id: "sjl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "巡课违纪",
      id: "ktwj",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "教学质量",
      id: "jxzl",
      level: "1"
    }, {
      name: "教学分析",
      id: "jxfx",
      level: "2",
      parentId: "jxzl"
    }, {
      name: "学生听讲反馈",
      id: "xstjfk",
      level: "2",
      parentId: "jxzl"
    },
    // {
    //      name:"课堂互动",
    //      id:"kthd",
    //      level:"2"
    // },
    {
      name: "资源情况",
      id: "zyqk",
      level: "1"

    }, {
      name: "教室使用",
      id: "jssy",
      level: "2",
      parentId: "zyqk"
    }, {
      name: "多媒体使用",
      id: "dmtsy",
      level: "2",
      parentId: "zyqk"
    }
  ],
  //学院画像右侧菜单数据
  collegeNavData: [
    {
      name: "基本信息",
      id: "jbxx",
      level: "1"
    }, {
      name: "教学秩序",
      id: "jxzx",
      level: "1"
    }, {
      name: "教师考勤",
      id: "jskq",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "到课率",
      id: "dkl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "前排就座率",
      id: "qpjzl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "低头率",
      id: "sjl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "巡课违纪",
      id: "ktwj",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "教学质量",
      id: "jxzl",
      level: "1"
    }, {
      name: "教学分析",
      id: "jxfx",
      level: "2",
      parentId: "jxzl"
    }, {
      name: "学生听讲反馈",
      id: "xstjfk",
      level: "2",
      parentId: "jxzl"
    },
    //  {
    //   name: "课堂互动",
    //   id: "kthd",
    //   level: "2"
    // },
    {
      name: "资源情况",
      id: "zyqk",
      level: "1"

    }, {
      name: "多媒体使用",
      id: "dmtsy",
      level: "2",
      parentId: "zyqk"
    }
  ],
  //课程画像右侧菜单数据
  courseNavData: [
    {
      name: "基本信息",
      id: "jbxx",
      level: "1"
    }, {
      name: "教学秩序",
      id: "jxzx",
      level: "1"
    }, {
      name: "教师考勤",
      id: "jskq",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "到课率",
      id: "dkl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "前排就座率",
      id: "qpjzl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "低头率",
      id: "sjl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "巡课违纪",
      id: "ktwj",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "教学质量",
      id: "jxzl",
      level: "1"
    }, {
      name: "教学分析",
      id: "jxfx",
      level: "2",
      parentId: "jxzl"
    }, {
      name: "学生听讲反馈",
      id: "xstjfk",
      level: "2",
      parentId: "jxzl"
    },
    //  {
    //   name: "课堂互动",
    //   id: "kthd",
    //   level: "2"
    // },
    {
      name: "资源情况",
      id: "zyqk",
      level: "1"

    }, {
      name: "多媒体使用",
      id: "dmtsy",
      level: "2",
      parentId: "zyqk"
    }
  ],
  //教师画像右侧菜单数据
  teacherNavData: [
    {
      name: "基本信息",
      id: "jbxx",
      level: "1"
    }, {
      name: "教学秩序",
      id: "jxzx",
      level: "1"
    }, {
      name: "教师考勤",
      id: "jskq",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "到课率",
      id: "dkl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "前排就座率",
      id: "qpjzl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "低头率",
      id: "sjl",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "巡课违纪",
      id: "ktwj",
      level: "2",
      parentId: "jxzx"
    }, {
      name: "教学质量",
      id: "jxzl",
      level: "1"
    }, {
      name: "教学分析",
      id: "jxfx",
      level: "2",
      parentId: "jxzl"
    }, {
      name: "学生听讲反馈",
      id: "xstjfk",
      level: "2",
      parentId: "jxzl"
    },
    //  {
    //   name: "课堂互动",
    //   id: "kthd",
    //   level: "2"
    // }
  ]
}
export default navList;