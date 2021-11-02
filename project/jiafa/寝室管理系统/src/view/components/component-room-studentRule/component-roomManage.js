/*
 * @Author: yhc 
 * @Date: 2021-01-15 14:06:27 
 * @Last Modified by: yhc
 * @Last Modified time: 2021-03-29 10:49:51
 */
import React,{useState,useEffect,useRef} from 'react'
import {Button,Cascader,Modal,Select,Drawer,Input,message,Progress,Empty,Radio } from 'antd'
import { SearchOutlined,CaretUpOutlined,CaretDownOutlined,ArrowUpOutlined,ArrowDownOutlined } from '@ant-design/icons';
import './../../../style/roomManage.scss'
import { useSelector } from "react-redux";
import {PaginationPonent} from './../../../view/components/common'
import SVG from './../../public/public-component-svg'
import {distributeQuickConfirm,roomManageAsClassSel,roomManageList,roomManageSearch,roomManageChange,roomManageRoom,roomManageRoomInfo,roomManageClassSearch,roomManageNameSearch} from './../../../request/page-room/stuManage'
// import { for } from 'core-js/fn/symbol';
export default function RoomManage(){
    const buildTree = useSelector(({ buildTree_reducer }) => buildTree_reducer).buildTree;
    const classTree = useSelector(({ classesTree_reducer }) => classesTree_reducer).buildTree;
    const {Option} = Select
    const {Search} = Input  
    const [option,setOption] = useState([{label:'全部',value:'all'}])
    const floorState = useRef('all')
    const roomType = useRef(1)
    const [orderCss,setOrderCss] = useState(2)
    //首页房间数据
    const [dataList,setDataList] = useState([])
    const [drawerVisibile,setDrawerVisibile] = useState(false)
    const [roomVisibile,setRoomVisibile] = useState(false)
    const [searchVisibile,setSearchVisibile] = useState(false)
    const [noDistributeVisibile,setNoDistributeVisibile] = useState(false)
    //抽屉标题
    const [title,setTitle] = useState('')
    const buildName = useRef('all')
    //搜索内容
    const [searchText,setSearchText] =useState('')
    //建筑树
    const [floor,setFloor] = useState([])
    const noDistribute = useRef([])
    //首页搜索输入状态--颜色样式管理
    const selectState = useRef(false)
    //初始颜色
    const color = [
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
        {
            backgroundColor:'#dddddd',
            cursor:'pointer'
        },   
    ]
    //颜色变量
    const groupColor = useRef(color)
    //首页搜索输入框数据
    const [searchResult,setSearchResult] = useState({})
    const [group,setGroup] = useState([])
    //搜索人员未分配接收数据
    const [toDistribute,setToDistribute] = useState([])
    //搜索人员未分配时，筛选寝室内的人员情况
    const [willDistribute,setWillDistribute] = useState([])
    //搜索人员未分配时，筛选寝室人员的渲染模板
    const copys = []
    const [copy,setCopy] = useState(copys)
    //首页搜索结果框数据
    const [result,setResult] = useState([])
    const searchInput = useRef([])
    //快速分配班级添加结果
    const [classResult,setClassResult] = useState([])
    //按寝室分配
    //寝室原有人信息
    const [asRoomInfo,setAsRoomInfo] = useState([])
    //寝室原有人--退出
    const [asRoomExit,setAsRoomExit] = useState([])
    //筛选人数信息
    const [asRoomGet,setAsRoomGet] = useState([])
    //快速分配-班级树
    const classOption = []
    const [options,setOptions] = useState([])
    const buildingId =useRef('')
    //班级渲染
    const [addClass,setAddClass] = useState([])
    //筛选人分配
    const [asRoomSet,setAsRoomSet] = useState([])
    //班级筛选
    const [classValue,setClassValue] = useState('all')
    //班级暂存
    const classSave = useRef([])
    //房间筛选
    //模态框状态
    const [modalState,setModalState] = useState(false)
    const [room,setRoom] = useState([])
    const percent = useRef(0)
    const [percentValue,setPercentValue] = useState(0)
    const [rateState,setRateState] = useState(false)
    const pageSize = 20
    const pageIndex = useRef(1)
    const [total,setTotal] = useState(dataList.length)
    //宿舍类型渲染
    const [roomTypeSet,setRoomTypeSet] = useState(1)
    const [floorIdSet,setFloorIdSet] = useState('all')
    const order = useRef(0)
    const roomingId = useRef('')
    const roomId = useRef('')
    const [classOptions,setClassOptions] = useState([])
    const classResults = useRef([])
    //按寝号分配搜索内容
    const AsRoomSearchText = useRef('')
    //按寝号分配班级id
    const classTreeId = useRef('')
    const [gradeOptionQ,setGradeOptionQ] = useState([{label:'全部',value:'all'}])
    const [classOptionQ,setClassOptionQ] = useState([{label:'全部',value:'all'}])
    const [gradeValues,setGradeValues] = useState('all')
    const [classValues,setClassValues] = useState('all')
    //快速分配-选择班级集合
    const [classList,setClassList] = useState([])
    //快速分配-选择宿舍集合
    const [roomList,setRoomList] = useState([])
    //快速分配存储班级树
    const [classSaveQ,setClassSaveQ] = useState([])
    const [optionQ,setOptionQ] = useState([])
    //快速分配-楼栋筛选
    const [buildOption,setBuildOption] = useState([{label:"全部",value:'all'}])
    const [floorOption,setfloorOption] = useState([{label:"全部",value:'all'}])
    const [roomOption,setroomOption] = useState([{label:"全部",value:'all'}])
    const [roomName,setRoomName] = useState({buildName:'',floorName:'',roomName:''})
    const [roomIds,setRoomIds] = useState('1')
    const [value1,setValue1] = useState('all')
    const [value2,setValue2] = useState('all')
    const [value3,setValue3] = useState(0)
    const [value4,setValue4] = useState(0)
    const [value5,setValue5] = useState(['all'])
    const [value6,setValue6] = useState(['all'])
    const [value7,setValue7] = useState(['all'])
    const [value8,setValue8] = useState(['all'])
    const [value9,setValue9] = useState(['--'])
    const value10 = useRef([])
    const [textValue,setTextValue] = useState('')
    const [distributeInfo,setDistributeInfo] = useState('')
    const [valueResult,setValueResult] = useState({noDistributeNum:'--', hasDistributeNum:'--'})
    const [defaultClassValue,setDefaultClassValue] = useState([])
    const [searchState1,setSearchState1] = useState(false)
    const [searchState2,setSearchState2] = useState(false)
    const buildType = useRef(0)
    const [freeBedRoom,setFreeBedRoom] = useState(0)
    const searchSex = useRef('')
    const roomSex = useRef('')
    const [searchTextIn,setSearchTextIn] = useState('')
    function createAsRoom(){
        let arr = [...copy]
        let ar = asRoomInfo
        let arrr = arr.map((val,index)=>{
            return(
                <div style={{marginRight:'30px',marginBottom:'20px'}} key={index+'asRoom'} onClick={(e)=>{if(val.stuName !='空闲'){
                        val.state = !val.state
                        let arr = [...asRoomExit]
                        let ar = [...copy]
                        ar[index].state = val.state
                        setCopy(ar)
                        if(val.state){
                            arr.push(val)                            
                        }
                        else{
                            arr = arr.filter((value,index)=>{
                                if(value.listId == val.listId){
                                    return false
                                }
                                else{
                                    return true
                                }
                            })                            
                        }
                        
                        setAsRoomExit(arr)
                        console.log(arr)                                     
                    }
                    }} className={val.state?'yhc-colorSet':'yhc-groupItem'}><span className='yhc-bed'>{index+1+'床'}</span>
                    <span style={{marginRight:'16%'}} className={val.stuName=='空闲'?'yhc-free':null}>{val.stuName}</span>
                </div>
            )
        })
        return arrr
    }
    function createAsRoomGet(){
        let arr = [...asRoomGet]
        arr = arr.map((val,index)=>{
            return(
                <div key={index+'get'} className={val.state?'yhc-colorSets':'yhc-groupItems'} onClick={()=>{
                    val.state = !val.state
                    let arr = [...asRoomGet]
                    arr[index].state = val.state
                    let arrr = [...asRoomSet]
                    
                    if(val.state){
                        arrr.push(val)
                    }
                    else{
                        arrr = arrr.filter((value,index)=>{
                            if(val.listId == value.listId){
                                return false
                            }
                            else{
                                return true
                            }
                        })
                    }
                    setAsRoomSet(arrr)                   
                    setAsRoomGet(arr)
                }}>
                    {val.stuName}
                </div>
            )
        })
        return arr
    }
    function colorSet(id,state){
        if(state){
            let obj =  {
                backgroundColor:'#3687D9',
                cursor:'pointer'
            }
            let arr = [...groupColor.current]
            arr.splice(id,1)
            arr.splice(id,0,obj)          
            groupColor.current = arr
        }
        else{
            let obj =  {
                backgroundColor:'#dddddd',
                cursor:'pointer'
            }            
            let arr = [...groupColor.current]
            arr.splice(id,1)
            arr.splice(id,0,obj)          
            groupColor.current = arr
        }
    }
    //小床渲染
    function createIcon(val){
        let arr = []
        for(let i=0;i<(val.totalBedNum-val.freeBedNum);i++){
            arr.push(
                <div key={i+'hasher'} className="yhc-iconSet">
                    <SVG type='chuangkaobei4' style={{color:'#3687D9',height:'18px',width:'18px'}}/>      
                </div>           
            )
        }
        for(let i=0;i<val.freeBedNum;i++){
            arr.push(
                <div key={i+'free'} className='yhc-iconSet'>
                    <SVG type='chuangkaobei4' style={{color:"black",height:'18px',width:'18px'}}/>      
                </div>           
            )
        }        
        return arr
    }
    //首页列表渲染
    function createList(){
        let arr = dataList?.map((val,index)=>{
            return(
                <div key={index+'block'} className='yhc-block'>
                    <div>
                        <div>{val.roomName}</div>
                        <span style={{cursor:'pointer'}} onClick={async ()=>{                            
                                roomSex.current = val.roomType
                                setRoomVisibile(true);
                                setTitle(val.roomName);
                                setAsRoomInfo(val);
                                roomingId.current = val.buildingId;
                                let arr = [];
                                if(val?.hasBedInfoList?.length){
                                    val?.hasBedInfoList?.map((value,index)=>{
                                        arr.push({stuName:value.stuName,state:false,listId:value.listId,sex:value.sex})
                                    })
                                }
                                for(let i = 0;i<(val.totalBedNum-val.hasBedInfoList?.length);i++){
                                    arr.push({stuName:'空闲',listId:'',state:false,sex:0})
                                }
                                setAsRoomGet([])
                                setCopy(arr)
                                await asClassSearch()
                                defaultClass()
                            }} >
                            <SVG type='bianji' style={{width:"15px",height:"15px",color:'black'}}/>                            
                        </span>

                    </div>
                    <div>
                        <div style={{display:"flex",alignContent:'center',justifyContent:'center',alignItems:'center',height:'100px',flexWrap:'wrap'}}>
                            {
                                createIcon(val)
                            }
                        </div>
                        <div>
                            <div>总床位数：{val.totalBedNum}</div>
                            <div>空余床位数：{val.freeBedNum}</div>
                        </div>
                    </div>
                </div>
            )
        })
        return arr
    }
    //首页搜索输入渲染
    function createGroup(){
        let arr = [...group]
        arr = arr.map((val,index)=>{
            return(
                <div key={index+'groupItemqwe'} style={{marginRight:'20px',marginBottom:'20px'}} onClick={(e)=>{if(val.stuName!='空闲'){
                        val.state = !val.state
                        let arr = [...noDistribute.current]
                        let ar = [...group]
                        ar[index].state = val.state
                        setGroup(ar)
                        if(val.state){
                            arr.push(val)                            
                        }
                        else{
                            arr = arr.filter((value,index)=>{
                                if(value.listId == val.listId){
                                    return false
                                }
                                else{
                                    return true
                                }
                            })                            
                        }
                        noDistribute.current = arr                                     
                        // console.log(arr)
                    }
                    }} className={val.state?'yhc-colorSet':'yhc-groupItem'}><span className='yhc-bed'>{index+1+'床'}</span>
                    <span style={{marginRight:'16%'}} className={val.stuName=='空闲'?'yhc-free':null}>{val.stuName}</span>
                </div>
            )
            
        })
        return arr
    }
    //首页搜索结果渲染
    function createResult(){
        let ar = [...result]
        // console.log(ar)
        let arr = ar.map((val,index)=>{
            return(
                <div key={index+'groupItemser'}
                     onClick={(e)=>{if(val.stuName){
                        val.state = !val.state;
                        let ar = [...result]
                        ar[index].state = val.state
                        setResult(ar)
                        let arr = [...searchInput.current]
                        if(val.state){
                            arr.push(val)
                        }
                        else{
                           arr = arr.filter((vals,index)=>{
                                if(vals.listId == val.listId){
                                   return false
                                }
                                else{
                                    return true
                                }
                           })
                           
                        }
                        searchInput.current = arr
                        // console.log(searchInput.current)
                    }
                    }} className={val.state?'yhc-colorSets':'yhc-groupItems'}>
                    {val.stuName}
                </div>
            )
        })
        return arr
    }
    //筛选内容渲染
    function getResult(){
        let arr = classResult.map((val,index)=>{
            return(
                <div key={index+'groupIt'} onClick={(e)=>{if(val.stuName){
                    selectState.current=!selectState.current;colorSet(index,selectState.current)}
                    }} style={groupColor.current[index]} className='yhc-getResult'>
                    {val.stuName}
                </div>
            )
        })
        return arr
    }
    //楼层获取
    function getFloor(arr){
        arr.map((val,index)=>{
                if(val.buildId == buildName.current){                  
                    setFloor(val.childrenList)
                }
                else if(val?.childrenList?.length){
                    getFloor(val.childrenList)
                }
        })
    }
    function createFloor(children){
        let arrr = [...floor]
        let arr = arrr.map((val,index)=>{
            return(
                <Option key={index + 'floor'} value={val.buildId}>{val.buildName}</Option>
            )
        })
        return arr
    }
    function createToDBT(){
        let arr = [...toDistribute]
        arr = arr.map((val,index)=>{
            return(
                <div key={index+'groupItemeddf'} onClick={(e)=>{
                    let arrr = [...toDistribute]
                    val.state = !val.state
                    arrr[index].state = val.state
                    setToDistribute(arrr)
                }} className={val.state?'yhc-colorSets':'yhc-groupItems'}>
                {val.stuName}
            </div>
            )
        })
        return arr
    }
    function createDidDBT(){
        let arr = [...copy]
        let arrr = arr.map((val,index)=>{
            return(
                <div style={{marginRight:'30px',marginBottom:'20px'}} key={index+'aba'} className={val.state?'yhc-colorSet':'yhc-groupItem'}><span className='yhc-bed'>{index+1+'床'}</span>
                <span style={{marginRight:'16%'}} className={val.stuName=='空闲'?'yhc-free':null}>{val.stuName}</span></div>
            )
        })
        return arrr
    }
    //首页搜索-搜索结果
    async function searchIn(){
        let obj = {
            roomType:roomType.current,
            searchText:searchText
        }
        let res = await roomManageSearch(obj)
        setGroup([])
        setResult([])
        setValue7(['all'])
        if(res?.code == 200){
            noDistribute.current = []
            searchInput.current = []
            setToDistribute([])
            setSearchResult(res.data)
            setValue9(res.data.roomName)
            if(res.data.roomState == 1){
                roomSex.current = res.data.hasBedInfoList[0].sex
                setSearchState1(true)
                setSearchState2(false)
                if(res.data.totalBedNum){
                    for(let i=0;i<res.data.totalBedNum-res.data.hasBedInfoList.length;i++){
                        arrr.push({
                            listId:'',
                            stuName:'空闲',
                            state:false
                        })
                        console.log(i)
                    }
                }
                setGroup(res.data.hasBedInfoList)
            }
            else{
                searchSex.current = res.data.hasBedInfoList[0].sex
                buildingTreeRe()
                // setNoDistributeVisibile(true);
                setSearchState1(false)
                setSearchState2(true) 
                setCopy([])
                if(res.data.hasBedInfoList?.length){                    
                    setToDistribute(res.data.hasBedInfoList)                 
                }            
                else{
                    setToDistribute([])
                }         
            }            
            setSearchResult(res.data)
        }
        else{
            message.warn(res?.message)
            setSearchState1(false)
            setSearchState2(false)
        }
        // setSearchText('')
    }
    function classTreeSet(){
        let arr = classOption.map((val,index)=>{
            return(
                <Option key={index+'class'} value={val.value}>{val.title}</Option>
            )
        })
        return arr
    }
    //快速分配班级渲染
    function addClassSet(){
        let arr = [...addClass]
        arr = arr.map((val,index)=>{
            return(
                <div key={index+'setClass'} className={'yhc-groupItems'}><span>{val?.gradeName+val.className}</span>
                <div style={{position:'absolute',right:'-7px',top:'-11px'}}
                    onClick={()=>{               
                        let arr = [...addClass]
                        arr = arr.filter((value,index)=>{
                            if(value.classId == val.classId){
                                return false
                            }
                            else{
                                return true
                            }
                        })
                        let count = 0
                        arr.map((vals,index)=>{
                            count += vals.classNum   
                        })
                        setValue4(count)
                        setAddClass(arr) 
                        // console.log(arr)               
                    }}
                >
                    <SVG type='yichu' style={{width:'18px',height:'18px',fill:'#696363'}} />                   
                </div>

                </div>
            )
        })
        return arr
    }
    //快速分配寝室渲染
    function createBuild(){
        let arr = [...room]
        arr = arr.map((val,index)=>{
            return(
                <div key={index+'setClass'} className={'yhc-groupItems'}><span>{val?.title}</span>
                <div style={{position:'absolute',right:'-8px',top:'-11px'}}
                onClick={()=>{
                    let arr = [...room]
                    console.log(arr)
                    arr = arr.filter((value,index)=>{
                        if(value.buildingId == val.buildingId){
                            return false
                        }
                        else{
                            return true
                        }
                    })
                    let count = 0
                    arr.map((vals,index)=>{
                        count += vals.totalBedNum
                    })
                    setFreeBedRoom(count)
                    setRoom(arr)                   
                }}
                >
                    <SVG type='yichu' style={{width:'18px',height:'18px',fill:'#696363'}} />                    
                </div>
</div>
            )
        })
        return arr
    }
    //快速分配-开始分配
    async function quickDistribute(){
        if(room?.length&&addClass?.length){            
            let arr = []
            room.map((val,index)=>{
                let obj = {
                    buildingId:val.buildingId,
                    totalBedNum:val.totalBedNum
                }
                arr.push(obj)
            })
            let arrr = []
            addClass.map((val,index)=>{
                let obj = {
                    classId:val.classId,
                    gradeId:val.gradeId,
                    classNum:val.classNum,
                    list:val.list,
                    number:val.number
                }
                arrr.push(obj)
            })
            let obj = {
                roomList:arr,
                classList:arrr,
                rule:value3,
                roomType:roomType.current
            }
            // if(value4>freeBedRoom){
            //     message.warn('分配寝室容量不足')
            // }
            // else{
            setDrawerVisibile(false);
            setModalState(true)
            setValueResult({noDistributeNum:'--', hasDistributeNum:'--'})
            stateSet()
            let res = await distributeQuickConfirm(obj)
            setDistributeInfo('正在分配，请勿关闭弹窗')
            let timer = setInterval(()=>{         
                if(percent.current<100){
                    let a = percent.current + 1   
                    percent.current = a
                    setPercentValue(percent.current)                     
                }
                else if(percent.current == 100){
                    if(res.code == 200){
                        setValueResult(res.data)  
                        roomSearch()                                          
                    }   
                    else{
                        message.warn(res.message)
                        setValueResult({noDistributeNum:'--', hasDistributeNum:'--'})
                    }
                    setDistributeInfo('分配结束')
                    clearInterval(timer)
                    setRateState(true) 
                    setFreeBedRoom(0)
                }
            },10)                    
            // }
        
        }
        else{
            message.warn('班级或宿舍不能为空')
        }
    }
    //首页列表搜索功能
    async function roomSearch(){
        // setDataList([])
        let obj = {
            roomType:roomType.current,
            buildingId:buildName.current,
            floorId:floorState.current,
            orderType:order.current,
            pageSize,
            pageIndex:pageIndex.current
        }
        let res = await roomManageList(obj)
        if(res?.code == 200){
            setDataList(res.data.dataList)
            setTotal(res.data.total)
        }
        else{
            message.warn(res?.message)
        }
        document.getElementById('scroll-content').scrollTop = 0;
    }
    //首页搜索功能
    async function  indexSearchConfirm(){
        setSearchVisibile(false)
    }
    //移入/移除
    async function changeState(arr,id,type) {
        // console.log(arr)
        arr = arr.map((val,index)=>{   
            let object = {
                listId:val.listId,
                sex:val.sex
            }        
            return object
        })
        let obj={
            type:type,
            buildingId:id,
            stuList:arr,
            roomType:roomSex.current
        }
        let res =await roomManageChange(obj)
        // let res = {code:200}
        console.log(res)
        if(res.code == 200){
            roomSearch()
        }
        else{
            
            message.warn(res?.message)
        }
        return res
    }
    //楼栋-递归
    function buildCircle(val,childrenList){
        let arr= childrenList?.map((value,index)=>{
            value['label'] = value.buildName
            value['value'] = value.buildId
            value['isLeaf'] = false
            if(value?.childrenList?.length){
                buildCircle(value,value.childrenList)
            }
            return value
        })
        val['children'] = arr
        return val
    }
    //楼栋树修改
    function buildingTreeRe(){
        let arrr = JSON.parse(JSON.stringify(buildTree))
        let arr= arrr.map((val,index)=>{
            val['label'] = val.buildName
            val['value'] = val.buildId
            val['isLeaf'] = false
            if(val?.childrenList?.length){
                val = buildCircle(val,val.childrenList)
            }
            return val
        })
        arr.unshift({label:"全部",value:'all'})
        setOption(arr)    
        console.log(arr)    
    }
    //加载数据
    const  loadData = async selectedOptions => {
        if(buildType.current == 2){
            let obj = {
                roomState:0,
                buildingId:selectedOptions[selectedOptions.length-1].value,
                roomType:searchSex.current
            }
            let res = await roomManageRoom(obj)
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.loading = true;
            targetOption.loading = false;
            if(res?.data?.dataList?.length){
                targetOption.children = res.data.dataList.map((val,index)=>{
                    let obj = {label:'',value:''}
                    obj.label = val.roomName
                    obj.value = val.buildingId
                    return obj
                })              
            }
            setOption([...option]);           
        }

      };
    //安寝号分配-按班级搜索
    async function asClassSearch() {
        let req = {
            roomType:roomTypeSet
        }
        let res = await roomManageClassSearch(req)
        // console.log(res)
        let arr = []
        let totalPerson = 0
        if(res.code == 200){
            res.data.dataList = res.data.dataList.map((val,index)=>{
                let obj = {label:val.className+`(待分配${val.number}人)`,value:val.classId}
                arr.push(obj)
                totalPerson += val.number
                val.list = val.list.map((vals,index)=>{
                    vals.state = false
                    return vals
                })
                return val
            })         
            classResults.current = res.data.dataList
        }
        else{
            message.warn(res.message)
        }
        arr.unshift({label:`全部班级(待分配${totalPerson}人)`,value:'all'})
        setClassOptions(arr)
    }
    //安寝号分配-按姓名搜索
    async function asNameSearch() {
        let req = {
            roomType:roomTypeSet,
            classId:classTreeId.current?classTreeId.current:'all',
            searchText:AsRoomSearchText.current
        }
        let res = await roomManageNameSearch(req)
        if(res.code == 200){
            setAsRoomGet(res.data.dataList)
        }
        else{
            message.warn(res.message)
        }
    }
    function treeSet(params) {
        classTreeQ()
    }
    //快速分配班级列表
    async function classTreeQ(params) {
        let req = {
            roomType:roomTypeSet
        }
        let res = await roomManageAsClassSel(req)
        console.log(res)
        if(res.code == 200){
            let arr = [{label:'全部',value:'all'}]
            res.data.dataList.map((val,index)=>{
                let obj = {
                    label:val.gradeName,
                    value:val.gradeId
                }
                arr.push(obj)
            })
            setGradeOptionQ(arr)
        }
        else{
            message.warn(res.message)
        }
        setClassSaveQ(res.data.dataList)
    }
    //快速分配-寝室列表
    async function getBuild(params) {
        console.log(buildTree)
        let arr = [...buildTree]
        let arrr = []
        arr?.map((val,index)=>{
            if(val?.plaType == 0){
                let obj ={
                    label:val.buildName,
                    value:val.buildId,
                    children:[]
                }
                if(val?.childrenList?.length){
                    val.childrenList?.map((value,index)=>{
                        let object = {
                            label:value.buildName,
                            value:value.buildId, 
                        }
                        obj.children.push(object)
                    })
                }
                arrr.push(obj) 
            }
            else{
                let obj ={
                    label:val.buildName,
                    value:val.buildId,
                }
                arrr.push(obj)  
            }         
        })
        arrr.unshift({value:'all',label:'全部'})
        setBuildOption(arrr)
    }
    function valueState(params) {
        setValue1('all')
        setValue2('all')
    }
    function stateSet(){
        setGradeValues('all');
        setClassValues('all')
        setValue6(['all'])
        setValue1('all')
        setValue2('all')
        setRoom([])
        setAddClass([])
        setValue4(0)
        setClassOptionQ([{value:'all',label:"全部"}])
        setfloorOption([{value:'all',label:"全部"}])
        setroomOption([{value:'all',label:"全部"}])
        setFreeBedRoom(0)
    }
    function defaultClass(params) {
        let arr = [...classResults.current]
        let arrr = []
        arr.map((val,index)=>{
            val.list.map((vals,index)=>{
                arrr.push(vals)
            })
        })
        setDefaultClassValue(arrr)
        setAsRoomGet(arrr)
    }
    function buildTypeGet(id) {
        buildTree?.map((val,index)=>{
            if(val?.buildId == id){
                buildType.current = val?.plaType
            }
            else if(val?.childrenList?.length){
                buildTypeGetCircle(val.childrenList,id)
            }
        })
    }
    function buildTypeGetCircle(arr,id) {
        arr?.map((val,index)=>{
            if(val?.buildId == id){
                buildType.current = val?.plaType
            }
            else if(val?.childrenList?.length){
                buildTypeGetCircle(val.childrenList,id)
            }
        })
    }
    function clearState(){
        setSearchTextIn('')
        setSearchText('')
        setSearchState1(false)
        setSearchState2(false)
        clearState1()
        setGroup([])
        setResult([])
        searchInput.current = []
        noDistribute.current = []
        setSearchVisibile(false)
    }
    function clearState1(){
        setNoDistributeVisibile(false);
        setValue7(['all'])
        setToDistribute([])
        buildingTreeRe()
        setCopy([])
        // setOption([{label:'全部',value:'all'}])
    }
    useEffect(()=>{
        //里面option
        buildingTreeRe()
       //外部option   
        let arrr = [...group]
        arrr = arrr.map((val,index)=>{
            val['order'] = index
            val['state'] = false
            return val
        })
        setGroup(arrr)
        roomSearch();
    },[])
    useEffect(()=>{
        let b = JSON.stringify(buildTree)
        let a = JSON.parse(b)  
        let ar = [{label:'全部',value:'all'}]
        if(a?.length){    
            a?.map((val,index)=>{        
                if(val?.plaType == 0){
                    let obj ={
                        label:val.buildName,
                        value:val.buildId,
                        children:[]
                    }
                    if(val?.childrenList?.length){
                        val.childrenList?.map((value,index)=>{
                            let object = {
                                label:value.buildName,
                                value:value.buildId, 
                            }
                            obj.children.push(object)
                        })
                    }
                    ar.push(obj) 
                }
                else{
                    let obj ={
                        label:val.buildName,
                        value:val.buildId,
                    }
                    ar.push(obj)  
                }  
                // ar.push(val)
            })            
        }
        else{
            
        }
        setOptions(ar) 
        console.log(ar)
    },[])
    return(
        <div>
            <div className='yhc-roomManageSelCss'>
                <div style={{fontSize:'18px',marginBottom:'20px'}}>房间分配管理</div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{width:'620px'}} className='yhc-roomManageSel yhc-cascader'>
                        <div>
                            <span>宿舍类型：</span>
                            <Select style={{width:'120px'}} 
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                value={roomTypeSet} onChange={(e)=>{
                                pageIndex.current = 1;
                                setRoomTypeSet(e);roomType.current=e;
                                setValue5(['all']);setFloorIdSet('all');
                                buildName.current = 'all';
                                floorState.current = 'all'                        
                                setFloor([])
                                roomSearch();
                                }}>
                                {/* <Option value={-1}>全部</Option> */}
                                <Option value={1}>男生宿舍</Option>                                
                                <Option value={2}>女生宿舍</Option>
                            </Select>
                        </div>
                        <div>
                            <span>楼栋：</span>
                                <Cascader 
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    value={value5} allowClear={false} style={{width:'180px'}} 
                                    options={options} onChange={(e)=>{                         
                                    pageIndex.current = 1;
                                    buildName.current=e[e.length-1];setFloorIdSet('all');
                                    setValue5(e)
                                    floorState.current = 'all';getFloor(buildTree);
                                    roomSearch()
                                    }}></Cascader>                                
                        </div>
                        <div>
                            <span>楼层：</span>
                            <Select 
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            style={{width:'120px'}} value={floorIdSet} onChange={(e)=>{pageIndex.current = 1;setFloorIdSet(e);floorState.current=e;roomSearch()}}>
                                <Option value={'all'}>全部</Option>
                                {
                                    createFloor()
                                }
                            </Select>
                        </div>
                    </div>
                    <Button type='primary' onClick={()=>{setSearchVisibile(true);setGroup([]);setResult([]);setValue9('--')}} icon={<SearchOutlined/>}>搜索</Button>
                </div>           
            </div>
            <div style={{padding:'20px'}} className='yhc-roomManageSel'>
                <div>
                    <Button className='yhc-svgFlex' type="primary" onClick={()=>{setDrawerVisibile(true);treeSet();getBuild();}} icon={<SVG type='fenpei' style={{color:'white',height:'15px',marginRight:'3px',width:'15px'}}/>}>快速分配</Button>
                </div>
                <div className='yhc-roomManageSel'>
                    <span style={{marginRight:'5px'}}>按空余床位排序</span>
                    <div className='yhc-order'>
                        <CaretUpOutlined onClick={()=>{setOrderCss(1);order.current=1;roomSearch()}} className={orderCss==1?'yhc-orderCss':null} style={{display:'block'}}/>
                        <CaretDownOutlined onClick={()=>{setOrderCss(2);order.current=0;roomSearch()}} className={orderCss==2?'yhc-orderCss':null} style={{display:'block',marginBottom:'6px'}}/>                        
                    </div>
                </div>
            </div>
            <div>
                <div className='yhc-blockSet'>
                    {
                        dataList.length?
                        createList()
                        :<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
                    }
               
                </div>    
                    <div style={{}}>
                        <PaginationPonent total={total} pageSize={pageSize} pageIndex={pageIndex.current} pageChange={(e)=>{pageIndex.current = e;roomSearch()}}></PaginationPonent> 
                    </div>                             
            </div>        
            <div className='yhc-draw'>
                <Drawer 
                    maskClosable={false}
                    closable={true}
                    title='快速分配' footer={<div style={{display:'flex',justifyContent:'center'}}>
                            <Button style={{marginRight:'20px'}} type='primary' onClick={quickDistribute}>开始分配</Button>
                            <Button type='primary' onClick={()=>{setDrawerVisibile(false);stateSet()}}>取消</Button>
                        </div>} getContainer={false} onClose={()=>{setDrawerVisibile(false);stateSet()}} visible={drawerVisibile}>
                        <div style={{padding:'20px'}}>
                            <div style={{padding:'20px',display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                                    <div style={{display:'flex',width:"100%"}}>
                                        <div>分配计算规则：</div>
                                        <Radio.Group onChange={(e)=>{setValue3(e.target.value)}} value={value3}>
                                            <Radio value={0}>按班级顺序自动插入</Radio>
                                            <Radio value={1}>按学号顺序自动插入</Radio>                                            
                                        </Radio.Group>

                                    </div>
                                    <div className='yhc-group'>
                                        <div style={{padding:'10px 0px 5px 15px',borderBottom:'1px solid #dddddd'}}>已选人数：{value4} 人</div>
                                        <div style={{display:'flex',flexWrap:'wrap',padding:'15px 0px 0px 15px',alignItems:'center'}}>                                         
                                            <div style={{marginTop:'15px',marginRight:'20px'}}>
                                                <span>年级：</span>
                                                <Select 
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                options={gradeOptionQ} value={gradeValues} onChange={async(e,line)=>{
                                                    setGradeValues(e)
                                                    let res = [...classSaveQ]                                                                                       
                                                    setClassValues('all')
                                                    let arr = [{label:'全部',value:'all'}]
                                                    res.map((val,index)=>{
                                                        if(val.gradeId == e){
                                                            console.log(val.children)
                                                            val.children.map((values,index)=>{
                                                                let obj = {
                                                                    label:values.className,
                                                                    value:values.classId
                                                                }
                                                                arr.push(obj)
                                                            })                                                
                                                        }
                                                    })                                                
                                                    setClassOptionQ(arr)
                                                }} style={{width:'140px'}}></Select>                                                
                                            </div>                                            
                                            <div style={{marginTop:'15px',marginRight:'20px'}}>
                                                <span>班级：</span>
                                                <Select 
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                options={classOptionQ} value={classValues} onChange={(e,line)=>{setClassValues(e)}} style={{width:'160px'}}>
                                                </Select>                                            
                                            </div>
                                            <Button icon={<SVG type='icon-test' style={{height:'13px',width:'13px',marginRight:'5px'}}></SVG>} style={{display:'flex',alignItems:'center',marginTop:'15px'}} type='primary' onClick={async()=>{
                                                let ar = classValues
                                                let arrr = gradeValues
                                                let arr  = [...addClass]                                              
                                                let res = [...classSaveQ]
                                                let num = value4
                                                let list = []
                                                let classNum = 0
                                                if(gradeValues=='all'||classValues=='all'){
                                                    message.warn('请选择班级')
                                                }
                                                else{
                                                    let state = true
                                                    arr.map((val,index)=>{
                                                        if(val.classId==ar){
                                                            state = false
                                                        }
                                                    })
                                                    if(state){
                                                        let gradeText = ''
                                                        let classText = ''
                                                        let number = 0
                                                        res.map((val,index)=>{
                                                            if(val.gradeId == arrr){
                                                                gradeText = val.gradeName
                                                                val.children.map((value,index)=>{
                                                                    if(ar==value.classId){
                                                                        classText = value.className
                                                                        list = value.list
                                                                        classNum = value.classNum
                                                                        number = value.number
                                                                        setValue4(num+value.number)
                                                                    }
                                                                })
                                                            }
                                                        })
                                                        let obj = {
                                                            gradeId:arrr,
                                                            gradeName:gradeText,
                                                            className:classText,
                                                            classId:ar,
                                                            classNum,
                                                            list,
                                                            number
                                                        }
                                                        arr.push(obj)
                                                    }
                                                    else{
                                                        message.warn('不能重复添加')
                                                    }
                                                }                                             
                                                setAddClass(arr)
                                                }}>添加</Button>
                                        </div>
                                        <div style={{padding:'0px 15px 15px 15px'}}>
                                            <div className='yhc-groupItemOnly-item'>
                                                {addClassSet()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='yhc-group'>
                                        <div style={{padding:'10px 0px 5px 15px',borderBottom:'1px solid #dddddd'}}>
                                            <span style={{display:'inline-block',marginRight:'20px'}}>已选寝室：{room.length} 间</span>
                                            <span>可分配床位数：{freeBedRoom}</span>
                                        </div>
                                        <div style={{padding:'0 15px 15px 15px'}}>
                                            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center'}}>
                                                <div style={{marginTop:'15px',marginRight:'20px'}} className='yhc-cascader'>
                                                    <span>楼栋：</span>
                                                    <Cascader 
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    allowClear = {false} value={value6} onChange={(e)=>{
                                                        setValue6(e)
                                                        let arr = [...buildTree]
                                                        let arrr = []
                                                        let text = roomName
                                                        arr = arr?.map((val,index)=>{
                                                            if(val?.plaType == 0){
                                                                if(val?.childrenList?.length){
                                                                    val.childrenList.map((value,index)=>{
                                                                        if(value?.buildId == e[e.length-1]){                                              
                                                                            // console.log(value.buildId)
                                                                            if(value?.childrenList?.length){
                                                                                // console.log(1)
                                                                                arrr = value.childrenList?.map((vals,index)=>{
                                                                                    let obj = {
                                                                                        label:vals.buildName,
                                                                                        value:vals.buildId
                                                                                    }                                                                                    
                                                                                    // text.buildName = val.buildName+value.buildName
                                                                                    // setRoomName(text)
                                                                                    return obj
                                                                                })
                                                                            }
                                                                            else{
                                                                                // console.log(2)
                                                                                arrr = []
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                            else if(val?.plaType == 1){
                                                                if(val?.buildId == e[e.length-1]){
                                                                    if(val?.childrenList?.length){
                                                                        val.childrenList?.map((value,index)=>{
                                                                            let obj = {
                                                                                label:value.buildName,
                                                                                value:value.buildId
                                                                            }
                                                                            arrr.push(obj)   
                                                                            // text.buildName = val.buildName
                                                                            // setRoomName(text)
                                                                        })
                                                                    }
                                                                    else{
                                                                        arrr = []
                                                                    }                                                                    
                                                                }
                                                                else{
                                                                    arrr = []
                                                                }
                                                            }
                                                        })
                                                        arrr.unshift({label:"全部",value:'all'})
                                                        // console.log(arrr)
                                                        setfloorOption(arrr)
                                                        setValue1('all')
                                                        setRoomIds('all')
                                                    }} style={{width:'170px'}} options={buildOption}></Cascader>
                                                </div>
                                                <div style={{marginRight:'20px',marginTop:'15px'}}>
                                                    <span>楼层：</span>
                                                    <Select 
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    onChange={async(e,line)=>{
                                                        setValue1(e)
                                                        let arr = [{label:"全部",value:'all'}]
                                                        // let text = roomName
                                                        let obj = {
                                                            roomState:1,
                                                            buildingId:e,
                                                            roomType:roomType.current
                                                        }
                                                        // text.floorName =  line.label
                                                        // setRoomName(text)                                                        
                                                        let res = await roomManageRoom(obj)
                                                        value10.current = res.data.dataList
                                                        if(res.code == 200){
                                                            if(res.data?.dataList?.length>=0){
                                                                res.data.dataList.map((val,index)=>{
                                                                    console.log(val)
                                                                    let obj = {
                                                                        label:val.roomName,
                                                                        value:val.buildingId
                                                                    } 

                                                                    arr.push(obj)
                                                                })
                                                                // console.log(arr)
                                                                setroomOption(arr)
                                                            }
                                                        }
                                                        else{
                                                            message.warn(res.message)
                                                        }                                                      
                                                        setValue2('all')
                                                        setRoomIds('all')
                                                    }} value={value1} options={floorOption} style={{width:'90px'}}></Select>
                                                </div>
                                                <div style={{marginTop:'15px',marginRight:'20px'}}>
                                                    <span>房间：</span>
                                                    <Select
                                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                    onChange={(e,line)=>{
                                                            setValue2(e)
                                                            setRoomIds(line.value)                                                           
                                                            let text = roomName
                                                            text.roomName = line.label
                                                            setRoomName(text)
                                                        }} options={roomOption} value={value2} style={{width:'200px'}}>                                                       
                                                    </Select>
                                                </div>
                                                <Button icon={<SVG type='icon-test' style={{height:'13px',width:'13px',marginRight:'5px'}}></SVG>} type='primary'  style={{display:'flex',alignItems:'center',marginTop:'15px'}} onClick={()=>{
                                                    let arr = [...room]
                                                    if(roomName&&(roomIds!='all')){
                                                        let bedtotal = 0
                                                        value10.current.map((val,index)=>{
                                                            if(val.buildingId == roomIds){
                                                                bedtotal = val.totalBedNum
                                                            }
                                                        })
                                                        let obj={
                                                            buildingId:roomIds,
                                                            title:roomName.buildName+roomName.floorName+roomName.roomName,                                                      
                                                            totalBedNum:bedtotal
                                                        }
                                                        let state = true
                                                        arr.map((val,index)=>{
                                                            if(val.buildingId == roomIds){
                                                                state = false
                                                            }
                                                        })
                                                        if(state){
                                                           arr.push(obj) 
                                                           setRoom(arr)
                                                           let count = 0
                                                           arr.map((vals,index)=>{
                                                                count += vals.totalBedNum
                                                           })
                                                           setFreeBedRoom(count)
                                                        }
                                                        else{
                                                            message.warn('请勿重复添加')
                                                        }                                                                                                             
                                                    }
                                                    else{
                                                        message.warn('请选择分配寝室')
                                                    }
                                                }}>添加</Button>
                                            </div>
                                            <div className='yhc-groupItemOnly-item'>
                                                {createBuild()}
                                            </div>
                                        </div>                                      
                                    </div>                               
                                </div>                               
                        </div>
                </Drawer>                 
                <Drawer 
                    maskClosable={false}
                    closable={true}
                    title={title} footer={<div style={{display:'flex',justifyContent:'center'}}>
                            {/* <Button style={{marginRight:'20px'}} type='primary' onClick={()=>{setAsRoomExit([]);setTextValue('');classTreeId.current = 'all';setRoomVisibile(false);setValue8('all')}}>确定</Button> */}
                            <Button type='primary' onClick={()=>{setAsRoomSet([]);setAsRoomExit([]);setTextValue('');classTreeId.current = 'all';setRoomVisibile(false);setValue8('all')}}>返回</Button>
                        </div>} getContainer={false} onClose={()=>{setAsRoomSet([]);setAsRoomExit([]);setTextValue('');classTreeId.current = 'all';setRoomVisibile(false);setValue8('all')}} visible={roomVisibile}>
                        <div style={{padding:'20px'}}>
                            <div style={{padding:'20px',display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                                <div className='yhc-group'>
                                    <div style={{padding:'15px'}}>
                                        <div className='yhc-groupItem-item'>
                                            {createAsRoom()}
                                        </div>
                                    </div>

                                </div>
                                <div className='yhc-transfer'>
                                    <Button onClick={ async()=>{
                                        let arr = [...copy]
                                        let ar = [...asRoomSet]
                                        // let arr= [...asRoomInfo]
                                        let arrr = [...asRoomGet]
                                        // console.log(ar)
                                        let state = true
                                        ar.map((val,index)=>{
                                            if(val.sex !=roomType.current){
                                                state = false
                                            }
                                        })
                                        if(state){
                                            let res = await changeState(ar,roomingId.current,1)
                                            if(res.code == 200){
                                                asClassSearch()
                                                ar = ar.filter((val,index)=>{
                                                    let state = true
                                                    arr.map((vals,index)=>{
                                                        if(state){
                                                            if(vals.stuName == '空闲'){
                                                                vals.stuName = val.stuName
                                                                vals.state = false
                                                                vals.listId = val.listId
                                                                vals.sex = val.sex
                                                                state = false
                                                                arrr = arrr.filter((value,index)=>{
                                                                    if(value.listId == val.listId){
                                                                        return false
                                                                    }
                                                                    else{
                                                                        return true
                                                                    }
                                                                })                                                    
                                                                return false
                                                            }                                                    
                                                        }
                                                    })                                         
                                                })                                            
                                            }
                                            else{
                                                message.warn(res.message)
                                            }
                                            setCopy(arr)
                                            setAsRoomGet(arrr)
                                            setAsRoomSet(ar)                                           
                                        }
                                        else{
                                            message.warn('分配学生性别不符')
                                        }
                                    }} icon={<ArrowUpOutlined />}></Button>
                                    <Button onClick={ async()=>{
                                        let arr = JSON.parse(JSON.stringify(asRoomGet))
                                        let ar = JSON.parse(JSON.stringify(asRoomExit))
                                        let arrr = JSON.parse(JSON.stringify(copy))
                                        let res = await changeState(ar,roomingId.current,0)                                       
                                        if(res.code == 200){
                                            asClassSearch()
                                            ar.map((val,index)=>{
                                                val.state = false
                                                arr.push(val)
                                                arrr = arrr.map((value,index)=>{
                                                    if(val.listId == value.listId){                                                                                                             
                                                        value.stuName = '空闲'
                                                        value.listId = ''
                                                        value.state = false
                                                    }
                                                    return value
                                                })
                                            })   
                                            setAsRoomExit([])
                                        }
                                        // console.log(arr)
                                        setCopy(arrr)
                                        setAsRoomGet(arr)

                                    }} icon={<ArrowDownOutlined />}></Button>
                                </div>
                                <div className='yhc-group'>
                                    <div style={{padding:'15px'}}>
                                        <div>
                                            <span>班级：</span><Select 
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                            value={value8} onChange={(e)=>{
                                                classTreeId.current = e
                                                setValue8(e)
                                                let arr = [...classResults.current]
                                                let arrr = []
                                                arr.map((val,index)=>{
                                                    if(e == val.classId){
                                                        setAsRoomGet(val.list)
                                                    }
                                                    val.list.map((vals,index)=>{
                                                        arrr.push(vals)
                                                    })
                                                })
                                                if(e == 'all'){
                                                    setAsRoomGet(arrr)
                                                }
                                            }} style={{width:'240px'}} options={classOptions}></Select>
                                            <Search value={textValue} onChange={(e)=>{setTextValue(e.target.value);AsRoomSearchText.current = e.target.value;}} style={{width:'240px',marginLeft:'20px'}} onSearch={asNameSearch} placeholder='学生姓名/证件号'></Search>
                                        </div>
                                        <div className='yhc-groupItemOnly-item'>
                                            {createAsRoomGet()}
                                        </div>
                                    </div>                                      
                                </div>                          
                            </div>
                        </div>
                </Drawer>                                
                <Drawer 
                    maskClosable={false}
                    closable={true}
                    title={'搜索'} footer={<div style={{display:'flex',justifyContent:'center'}}>
                            {/* <Button style={{marginRight:'20px'}} type='primary' onClick={indexSearchConfirm}>确定</Button> */}
                            <Button type='primary' onClick={()=>{clearState()}}>返回</Button>
                        </div>} getContainer={false} onClose={()=>{clearState()}} visible={searchVisibile}>
                        <div style={{padding:'20px',display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
                            <div style={{width:"100%"}}>
                                <Search style={{width:'45%'}} enterButton='搜索' placeholder='请完整输入学生姓名/学号' value={searchTextIn} onChange={(e)=>{
                                    let specialKey = "[`%~!#$^&*()=|{}:;,\\[\\].<>/?~！#￥……&*（）——|{}【】；：”“。，、？]";
                                    let flag = false
                                    for(let i = 0;i<e.target.value.length;i++){
                                        if(specialKey.indexOf(e.target.value.substr(i,1))>=0){
                                            flag = true
                                        }
                                    }
                                    if(flag){
                                        message.warn('请勿输入特殊字符：'+specialKey)
                                    }
                                    else{
                                        let length = e.target.value.split('').length;
                                        if(length<32){
                                            setSearchTextIn(e.target.value)
                                            setSearchText(e.target.value.trim())  
                                        }                                   
                                    }
                                }} onSearch={searchIn}></Search>
                            </div>
                            
                            {
                                searchState1?<div style={{width:'100%'}}>
                                    <div className='yhc-group'>
                                        <div>
                                            <div style={{padding:'10px 15px',borderBottom:"1px solid #dddddd"}}>{value9}</div>
                                            <div className='yhc-groupItem-item'>
                                                {createGroup()}
                                            </div>
                                        </div>

                                    </div>
                                    <div className='yhc-transfer'>
                                        <Button onClick={async()=>{
                                            let arr = [...group]
                                            let arrr = [...searchInput.current]
                                            let ar = [...result]
                                            // console.log(searchInput.current)
                                            let state = true
                                            arrr.map((val,index)=>{
                                                if(val.sex != roomSex.current){
                                                    state = false
                                                }
                                            })
                                            if(state){
                                                let res =await changeState(searchInput.current,searchResult?.buildingId,1)
                                                if(res.code == 200){
                                                    arrr.map((val,index)=>{
                                                        let state = true
                                                        arr = arr.map((vals,index)=>{
                                                            if(state){
                                                                if(vals.stuName == '空闲'){
                                                                    vals.stuName = val.stuName
                                                                    vals.listId = val.listId
                                                                    vals.order = val.state
                                                                    vals.state = false
                                                                    state = false
                                                                }                                                          
                                                            }                                                                            
                                                            return vals
                                                        })
                                                        ar = ar.filter((value,index)=>{
                                                            if(value.listId == val.listId){
                                                                return false
                                                            }
                                                            return true
                                                        })  
                                                        setResult(ar)                                      
                                                    })                                        
                                                }
                                                setGroup(arr)
                                                searchInput.current = []                                         
                                            }
                                            else{
                                                message.warn('入寝所选学生性别不符')
                                            }

                                        }} icon={<ArrowUpOutlined />}></Button>
                                        <Button onClick={async()=>{
                                            let a = JSON.stringify(group)                                   
                                            let arr=[...noDistribute.current]
                                            let arrr = [...result]
                                            let ar = JSON.parse(a)  
                                            let res = await changeState(noDistribute.current,searchResult?.buildingId,0) 
                                            // console.log(res)                                
                                            if(res.code == 200){
                                                arr.map((val,index)=>{
                                                        val.state = false
                                                        arrr.push(val)                                                                                  
                                                    ar = ar.map((values,index)=>{
                                                        if(values.listId == val.listId){
                                                            values.stuName = '空闲'
                                                            values.listId = ''
                                                            values.order = ''
                                                            values.state = false
                                                        }
                                                        return values
                                                    }) 
                                                })    
                                                setGroup(ar)
                                                setResult(arrr)                                                                            
                                            }
                                            else{
                                                message.warn(res.message)
                                            }
                                            noDistribute.current = []
                                        }} icon={<ArrowDownOutlined />}></Button>
                                    </div>
                                    <div className='yhc-group'>
                                        <div>
                                            <div style={{padding:'10px 15px',borderBottom:"1px solid #dddddd"}}>未分配</div>
                                            <div className='yhc-groupItem-item'>
                                                {createResult()}
                                            </div>
                                        </div>                                      
                                    </div>                                                                  
                                </div>
                                :
                                <div style={{width:'100%'}}>
                                    {
                                        searchState2?
                                        <div style={{width:'100%'}}>
                                            <div className='yhc-group'>
                                                <div>
                                                    <div style={{borderBottom:'1px solid #dddddd',padding:'10px 15px'}}>未分配</div>
                                                    <div className='yhc-groupItem-item'>
                                                        {createToDBT()}
                                                    </div>
                                                </div>                                      
                                            </div>
                                            <div className='yhc-transfer'>
                                                <Button disabled icon={<ArrowUpOutlined />}></Button>
                                                <Button icon={<ArrowDownOutlined />} onClick={async()=>{
                                                    let arr = [...toDistribute]
                                                    // console.log(arr)         
                                                    let arrr = [...willDistribute]
                                                    let ar = [...copy]
                                                    // let state = true
                                                    // arr.map((val,index)=>{
                                                    //     if(val.sex != searchSex.current){
                                                    //         state = false
                                                    //     }
                                                    // })
                                                    // if(state){
                                                        if(arr[0]?.state){
                                                            if(value7 == 'all' || copy.length === 0){
                                                                message.warn('请选择分配寝室')
                                                            }
                                                            else{
                                                                let res = await changeState(toDistribute,roomId.current,1)
                                                                if(res?.code == 200){                                          
                                                                    let state = true                                    
                                                                    ar = ar.map((val,index)=>{
                                                                        if(state){
                                                                            if(val.stuName == '空闲'){
                                                                                val.stuName = arr[0].stuName
                                                                                val.state = false  
                                                                                state = false                                                  
                                                                            }                                                                                             
                                                                        }
                                                                        return val
                                                                    })  
                                                                    setToDistribute([])  
                                                                    setCopy(ar)    
                                                                }
                                                                else{
                                                                    message.warn(res.message)
                                                                }                                            
                                                            }                                                                             
                                                        }
                                                        else{
                                                            message.warn('请选择移入学生')
                                                        }
                                                        setWillDistribute([])                                        
                                                    // }
                                                    // else{
                                                    //     message.warn('所分配学生性别不符')
                                                    // }
                                                }}></Button>
                                            </div>
                                            <div className='yhc-group'>
                                                <div style={{padding:'15px'}}>
                                                    <div className='yhc-cascader'>
                                                        <span>宿舍：</span>
                                                        <Cascader 
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                        style={{width:'360px'}} allowClear={false} options={option} value={value7} loadData={loadData}
                                                        onChange={async(e)=>{
                                                            setValue7(e)
                                                            roomId.current = e[e.length-1]
                                                            buildTypeGet(roomId.current)
                                                            console.log(buildType.current)
                                                            if(buildType.current === 2){
                                                                let req = {
                                                                    buildingId:roomId.current,
                                                                    roomType:searchSex.current
                                                                }
                                                                let res = await roomManageRoomInfo(req)
                                                                let arr = []                                
                                                                if(res.code == 200){     
                                                                    if(res.data){
                                                                        if(res.data?.roomType == searchSex.current){
                                                                            roomSex.current = res.data.roomType
                                                                            if(res?.data?.hasBedInfoList?.length){
                                                                                res.data?.hasBedInfoList.map((val,index)=>{
                                                                                arr.push({stuName:val.stuName}) 
                                                                                })
                                                                                for(let i = 0;i<res.data.freeBedNum;i++){
                                                                                    arr.push({stuName:'空闲'})
                                                                                }
                                                                            }
                                                                            else{
                                                                                if(res?.data?.totalBedNum){
                                                                                    for(let i = 0;i<res.data.freeBedNum;i++){
                                                                                    arr.push({stuName:'空闲'})
                                                                                    }                                                       
                                                                                }
                                                                            }                                                                              
                                                                        }
                                                                        else{
                                                                            message.warn('所分配学生性别不符')
                                                                        }                                                                        
                                                                    }                                                                  
                                                                    setCopy(arr)
                                                                    setWillDistribute(arr)
                                                                }
                                                                else{
                                                                    message.warn(res.message)
                                                                }                                                
                                                            }
                                                        }} 
                                                        changeOnSelect />
                                                    </div>
                                                    <div className='yhc-groupItem-item'>
                                                        {createDidDBT()}
                                                    </div>
                                                </div>
                                            </div>                                    
                                        </div>                                        
                                        :
                                        <Empty style={{marginTop:'200px'}} image={Empty.PRESENTED_IMAGE_SIMPLE}/>                
                                    }
                                </div>

                                
                            }
                      
                        </div>
                </Drawer>                 
                {/* <Drawer title={title} footer={<div style={{display:'flex',justifyContent:'center'}}>                       
                            <Button type='primary' onClick={()=>{clearState1()}}>返回</Button>
                        </div>} getContainer={false} onClose={()=>{clearState1()}} visible={noDistributeVisibile}>
                        <div style={{padding:'20px'}}>
                        <div style={{padding:'20px',display:'flex',justifyContent:'center',flexWrap:'wrap'}}>                                                  
                        </div>
                        </div>
                </Drawer>    */}           
            </div>         
            <div className='yhc-modal'>
                <Modal onCancel={()=>{setModalState(false)}} footer={rateState?(<div className="yhc-modalFlex">
                    <Button type='primary' onClick={()=>{setModalState(false);setPercentValue(0);percent.current = 0;setRateState(false)}}>确认</Button>
                    <Button onClick={()=>{setModalState(false);setPercentValue(0);percent.current = 0;setRateState(false)}}>取消</Button>
                </div>):(<div style={{height:'32px'}}></div>)} style={{marginTop:'7%'}} title='快速分配' visible={modalState}>
                        <div className='yhc-modalFlex'>
                            <div style={{width:'80%',textAlign:'center'}}>{distributeInfo}</div>
                            <div style={{width:'85%',margin:'15px 0px 10px 0px'}}>
                                <Progress percent={percentValue}></Progress>
                            </div>
                            <div className='yhc-modalFlex'>
                                <span style={{marginRight:'50px'}}>分配人员：{valueResult?.hasDistributeNum}人</span>
                                <span>未分配人员：{valueResult?.noDistributeNum}人</span>
                            </div>
                        </div>
                </Modal>                
            </div>
        </div>
    )
}