(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-f47215a2"],{"298a":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"student-timetable"},[n("div",{staticClass:"left"},[e.showTree?n("a-tree",{attrs:{"tree-data":e.treeData,"load-data":e.onLoadData,replaceFields:{children:"children",key:"orgId",value:"orgId",title:"orgName",isLeaf:"hasChildren",parentCode:"parentCode",placeType:"placeType"},showLine:"",selectedKeys:e.selectedKeys},on:{select:e.handleSelect}}):n("div",{staticClass:"left-spin"},[n("a-spin")],1)],1),n("div",{staticClass:"right"},[n("div",{staticClass:"select"},[e._v(" 筛选："),n("a-checkbox-group",{attrs:{disabled:!e.selectedKeys.length||e.tableLoading,value:e.checkedList,options:e.plainOptions},on:{change:e.onChange}})],1),n("div",{staticClass:"rightcontent"},[n("a-table",{staticClass:"timetable",attrs:{scroll:{y:"calc(100vh - 280px)"},columns:e.columns,"data-source":e.timetableList,loading:e.tableLoading,pagination:!1,rowKey:function(e){return e.id},bordered:""},scopedSlots:e._u([{key:"lesSort",fn:function(t){return[n("b",[e._v(" "+e._s(t)+" ")])]}},e._l(e.lesWeek,(function(t,r){return{key:t,fn:function(t){return[n("div",{key:r},e._l(t,(function(t,r){return n("div",{directives:[{name:"show",rawName:"v-show",value:!t.isHoliday,expression:"!item.isHoliday"}],key:r,staticClass:"unit"},[e.filtrateStatus.course?n("b",{staticClass:"little-unit"},[e._v(e._s(t.lesSub)+e._s(1==t.dbWeek?"[单周]":2==t.dbWeek?"[双周]":""))]):e._e(),n("div",{staticClass:"little-unit"},[e._l(t.lesTeacher,(function(r,s){return n("span",{directives:[{name:"show",rawName:"v-show",value:e.filtrateStatus.teacher&&r.main,expression:"filtrateStatus.teacher && o.main"}],key:s},[e._v(e._s(r.name)+" "),n("a-popover",{directives:[{name:"show",rawName:"v-show",value:t.lesTeacher.length>1,expression:"item.lesTeacher.length > 1"}],attrs:{trigger:"hover",content:e.getLesTeacher(t.lesTeacher)}},[n("a-icon",{staticStyle:{"font-size":"15px",cursor:"pointer",color:"#1890ff"},attrs:{type:"user"}})],1)],1)})),e._v(" "+e._s(e.filtrateStatus.classRoom&&e.filtrateStatus.teacher?"/":"")+e._s(e.filtrateStatus.classRoom?t.lesPlace:"")+" ")],2),e.filtrateStatus.class?n("div",{staticClass:"little-unit"},[e._v(" "+e._s(t.classes)+" ")]):e._e()])})),0)]}}}))],null,!0)})],1)])])},s=[],a=n("0951"),i=n.n(a),o=n("dad3");function l(e){return f(e)||d(e)||u(e)||c()}function c(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function u(e,t){if(e){if("string"===typeof e)return h(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?h(e,t):void 0}}function d(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function f(e){if(Array.isArray(e))return h(e)}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function p(e,t,n,r,s,a,i){try{var o=e[a](i),l=o.value}catch(c){return void n(c)}o.done?t(l):Promise.resolve(l).then(r,s)}function m(e){return function(){var t=this,n=arguments;return new Promise((function(r,s){var a=e.apply(t,n);function i(e){p(a,r,s,i,o,"next",e)}function o(e){p(a,r,s,i,o,"throw",e)}i(void 0)}))}}function g(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?g(Object(n),!0).forEach((function(t){v(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):g(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function v(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var y=[{title:"时段",dataIndex:"diffNoon",key:"diffNoon",align:"center",width:"6%",scopedSlots:{customRender:"diffNoon"},customCell:function(){return{style:{background:"#fafafa"}}},customRender:function(e,t){return{children:t.diffNoon,attrs:{rowSpan:t.diffNoonRowSpan}}}},{title:"节次",dataIndex:"lesSort",key:"lesSort",align:"center",width:"10%",scopedSlots:{customRender:"lesSort"},customCell:function(){return{style:{background:"#fafafa"}}}},{title:"星期一",dataIndex:"lesMon",key:"lesMon",align:"center",width:"12%",scopedSlots:{customRender:"lesMon"},slots:{title:"lesMon"}},{title:"星期二",dataIndex:"lesTue",key:"lesTue",align:"center",width:"12%",scopedSlots:{customRender:"lesTue"},slots:{title:"lesTue"}},{title:"星期三",dataIndex:"lesWed",key:"lesWed",align:"center",width:"12%",scopedSlots:{customRender:"lesWed"},slots:{title:"lesWed"}},{title:"星期四",dataIndex:"lesThu",key:"lesThu",align:"center",width:"12%",scopedSlots:{customRender:"lesThu"},slots:{title:"lesThu"}},{title:"星期五",dataIndex:"lesFri",key:"lesFri",align:"center",width:"12%",scopedSlots:{customRender:"lesFri"},slots:{title:"lesFri"}},{title:"星期六",dataIndex:"lesSat",key:"lesSat",align:"center",width:"12%",scopedSlots:{customRender:"lesSat"},slots:{title:"lesSat"}},{title:"星期日",dataIndex:"lesSun",key:"lesSun",align:"center",width:"12%",scopedSlots:{customRender:"lesSun"},slots:{title:"lesSun"}}],w=(o["b"],{name:"StudentTimetable",components:{},props:{},data:function(){return{columns:y,timetableList:[],tableLoading:!1,plainOptions:["教师","教室","班级","课程"],checkedList:["教师","教室","班级","课程"],seleLoading:!1,treeData:o["c"],showTree:!1,selectedKeys:[],lesWeek:["lesMon","lesTue","lesWed","lesThu","lesFri","lesSat","lesSun"]}},computed:{filtrateStatus:function(){var e=this.checkedList,t={teacher:e.includes("教师"),classRoom:e.includes("教室"),class:e.includes("班级"),course:e.includes("课程")};return t}},mounted:function(){this.arrLessonId=sessionStorage.getItem("arrLessonId"),this.getStudentsTree("00",1)},methods:{onChange:function(e){if(!e.length)return this.$message.warn("至少勾选一个");this.checkedList=e},getLesTeacher:function(e){var t="副教师：",n=e.filter((function(e){return!e.main}));return n.map((function(e,n){e.main||(0==n?t+=e.name:t=t+"/"+e.name)})),t},rowSpanMerge:function(e){var t=this,n=this.timetableList.reduce((function(t,n){return t.indexOf(n[e])<0&&t.push(n[e]),t}),[]).reduce((function(n,r){var s=t.timetableList.filter((function(t){return t[e]===r}));return n=n.concat(s.map((function(t,n){return b(b({},t),{},v({},"".concat(e,"RowSpan"),0===n?s.length:0))}))),n}),[]);this.timetableList=n},onLoadData:function(e){var t=this;return new Promise(function(){var n=m(i.a.mark((function n(r){var s;return i.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(!e.dataRef.children){n.next=3;break}return r(),n.abrupt("return");case 3:return n.next=5,t.getStudentsTree(e.dataRef.orgId,e.dataRef.orgType+1);case 5:s=n.sent,e.dataRef.children=s,t.treeData=l(t.treeData),r();case 9:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())},getStudentsTree:function(e,t){var n=this;return m(i.a.mark((function r(){var s,a,o,l;return i.a.wrap((function(r){while(1)switch(r.prev=r.next){case 0:return s=n.arrLessonId,a={planId:s,parentId:e,orgType:t},r.next=4,n.$api.Common.getStudentsTree(a);case 4:if(o=r.sent,console.log("data",o),200!=o.code){r.next=15;break}if(l=o.data.list.map((function(e){return e.isLeaf=!e.hasChildren,e})),"00"!==e){r.next=12;break}n.treeData=l,r.next=13;break;case 12:return r.abrupt("return",l);case 13:r.next=16;break;case 15:n.$message.error("请求失败！"+o.message);case 16:n.showTree=!0;case 17:case"end":return r.stop()}}),r)})))()},getStudentsTimetable:function(e){var t=this;return m(i.a.mark((function n(){var r,s;return i.a.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return r=t.arrLessonId,t.tableLoading=!0,n.next=4,t.$api.PreviewTimetable.getStudentsTimetable({stuId:e,arrLessonId:r});case 4:s=n.sent,200==s.code?(t.timetableList=s.data.list,t.rowSpanMerge("diffNoon")):t.$message.error("请求失败！"+s.message),t.seleLoading=!1,t.tableLoading=!1;case 8:case"end":return n.stop()}}),n)})))()},handleSelect:function(e,t){console.log(e,t);var n=t.node.dataRef.hasChildren;this.seleLoading||!e.length||n||(this.seleLoading=!0,this.selectedKeys=e,this.getStudentsTimetable(e[0]))}}}),S=w,k=(n("9375"),n("cba8")),T=Object(k["a"])(S,r,s,!1,null,"072e34c2",null);t["default"]=T.exports},"64d4":function(e,t,n){},9375:function(e,t,n){"use strict";n("64d4")}}]);
//# sourceMappingURL=chunk-f47215a2.961a783e.js.map