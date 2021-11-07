/*
 * @Author: lxx 
 * @Date: 2020-01-14 13:44:00 
 * @Last Modified by: lxx
 * @Last Modified time: 2020-08-06 13:49:31
 * 搜索带下拉框组件
 */
import React, { useState, useEffect, useCallback } from 'react';
import { List } from 'react-virtualized';
import _ from 'lodash'
import './element.scss';
import { Icon } from 'antd';


let blurNum = 1;


/**
 * @param {Number} width 输入框宽度
 * @param {String} value  选中项id
 * @param {Array} list  下拉列表数据，格式必须为[{id: '项id','name': '项名称', ....}]，默认传全部
 * @param {Function} onChange 选中项回调
 * @param {Function} onSearch 搜索框输入回调
 */

/**
 * 选择内容修改
 * @param {*} obj 
 */
const getVal = (obj) => {
    const [name, setName] = useState('');
    const [selId, setSelId] = useState('');
    const [selObj, setSelObj] = useState(null);

    const callback = useCallback(params => {
        if (params) {
            setName(params.name)
            setSelId(params.id)
            setSelObj(params)
        } else {
            setName('')
            setSelId('')
            setSelObj(null)
        }

    }, [obj])
    // console.log(selObj)
    return [callback, { name, selId, selObj }]
}


/**
 * 下拉搜索组件
 * @param {*} props 
 * @param {*} objParams 
 */
const SelInput = (props, objParams) => {
    const [idName, setIdName] = useState('ipt' + Math.floor(Math.random() * 100)); // 输入框值
    const [inpVal, setInpVal] = useState(''); // 输入框值
    const [plaCnt, setPlaCnt] = useState(''); // 输入框当前选中值
    const [saveList, setSaveList] = useState([]); // 下拉列表数据
    const [saveObj, setSaveObj] = useState(null); // 下拉选中数据
    const [list, setList] = useState([]); // 下拉列表数据
    const [width, setWidth] = useState(props.width || 200); // 组件宽度
    const [height, setHeight] = useState(props.height || 50); // 下拉高度
    const [setObj, setSetObj] = useState({ isShowList: false, isScroll: false, isBlur: false, isBtn: false }); // 各项配置
    const [scrBlur, setScrBlur] = useState(false); // 下拉列表是否显示下拉  true 显示   false 不显示
    const [isClick, setIsClick] = useState(false); // 点击是否显示下拉  true 显示   false 不显示
    const [callback, { name, selId, selObj }] = getVal(objParams); // 下拉选择值
    const [saveNum, setSaveNum] = useState(1); // 次数


    useEffect(() => {
        // 监听窗口变化下拉列表宽度变化
        window.addEventListener("resize", function () {
            if (document.getElementById(`${idName}`)) {
                let par = document.getElementById(`${idName}`);
                setWidth(par.clientWidth)
            }
        }, false);
        return componentWillUnmount;
    }, [])

    function componentWillUnmount() {
        setInpVal('')
        setPlaCnt('')
        callback(null);
    }

    useEffect(() => {
        if (props.value === '' && saveObj && !plaCnt) {
            // 重置选中显示数据
            // console.log('重置选中显示数据')
            callback(null);
            setInpVal('');
        }
        // 更新下拉列表数据
        if (props.list && list && list !== props.list) {
            setList(props.list);
            // 更新list
            if (saveNum === 1 && props.list.length) {
                console.log('进来存数据', props.value, saveObj)
                setSaveList(props.list)
                setSaveNum(2);
            }
            let len = props.list.length;
            // console.log('len', len)
            setHeight(len && len < 11 ? len * 32 : len ? 270 : 50)
        }
        // 更新输入框值
        if (props.value && saveObj && props.list && props.value !== saveObj.id) {
            // 传值非空，上一次有存值，该次传值与保存值不相等
            // console.log('传值非空，上一次有存值，该次传值与保存值不相等')
            let ind = _.findIndex(props.list, { 'id': props.value });
            let item = props.list[ind];
            callback(item);
            setSaveObj(item);
            setInpVal(item ? item.name : '');
        }
        if (props.value && !saveObj && props.list && props.list.length) {
            // 传值非空，初次传值
            // console.log('传值非空，初次传值')
            let ind = _.findIndex(props.list, { 'id': props.value });
            let item = props.list[ind];
            callback(item);
            setSaveObj(item);
            setInpVal(item ? item.name : '');
        }
        if (props.value && saveObj && props.value === saveObj.id && !plaCnt) {
            // 已有选值，清空输入框，回置之前选中数据
            // console.log('看能不能清空输入框')
            callback(saveObj);
            setInpVal(saveObj.name);
        }
    }, [props])

    useEffect(() => {
        // console.log(114)
        // 下拉列表展开，定位当前选中项位置
        if (setObj.isScroll) {
            if (document.getElementById(`${idName}`)) {
                let par = document.getElementById(`${idName}`);
                setWidth(par.clientWidth)
            }
            setTimeout(() => {
                let ind = _.findIndex(list, { 'id': selId });
                if (document.getElementsByClassName('ReactVirtualized__Grid')[0] && document.getElementsByClassName('ReactVirtualized__Grid__innerScrollContainer')) {
                    document.getElementsByClassName('ReactVirtualized__Grid')[0].scrollTop = ind > 10 ? (ind * 32 - 240) : 0;
                }
            }, 100);
        }

    }, [setObj.isScroll])

    useEffect(() => {
        if (isClick && !scrBlur) {
            if (setObj.isShowList && setObj.isScroll) {
                // console.log('输入框失去焦点')
                let interval;
                interval = setInterval(() => {
                    setSetObj({ isShowList: false, isScroll: false, isBlur: false, isBtn: false })
                    blurNum = 1;
                    setIsClick(false)
                    setPlaCnt('')
                    setInpVal(plaCnt)
                    getBoxHeight()
                }, 100);
                return () => clearInterval(interval);
            }
        }

        if (scrBlur) {
            // console.log('setObj.isScroll' ,setObj.isScroll , 'setObj.isBtn', setObj.isBtn)
            if (setObj.isScroll) {
                // console.log('下拉列表失去焦点')
                let inter;
                inter = setInterval(() => {
                    setSetObj({ isShowList: false, isScroll: false, isBlur: false, isBtn: false })
                    blurNum = 1;
                    // setIsScroll(true)
                    setPlaCnt('')
                    setInpVal(plaCnt)
                    getBoxHeight()
                }, 100);
                return () => clearInterval(inter);
            }
        }

        if (!setObj.isShowList && !setObj.isScroll && !setObj.isBlur && !setObj.isBtn) {
            setIsClick(false)
            setScrBlur(false)
        }
    }, [isClick, scrBlur, setObj])

    /**
     * 计算下拉列表高度
     */
    function getBoxHeight() {
        // console.log('saveList', JSON.parse(JSON.stringify(saveList)))
        setList(JSON.parse(JSON.stringify(saveList)))
        let len = saveList.length;
        setHeight(len && len < 11 ? len * 32 : len ? 270 : 50)
    }

    /**
     * 搜索值变更
     * @param {*} e
     * @returns
     */
    const SearchInpt = (e) => {
        let value = e.target.value;
        // console.log(!value)
        setInpVal(value);
        props.onSearch(value);

    }

    /**
     * 获取、失去焦点判断
     * @param {*} type true 显示 false 不显示
     */
    function getFocusFun(type) {
        if (type) {
            blurNum = 1;
            setIsClick(false)
            setPlaCnt(inpVal)
            setInpVal('')
            setSetObj({ isShowList: true, isScroll: true, isBlur: false, isBtn: false })
        } else {
            blurNum++;
            setTimeout(() => {
                // console.log('进来了吗', isClick)
                setIsClick(true)
                // console.log(isClick)
            }, 100);
        }
    }

    /**
     * 开关下拉
     */
    function closeSel() {
        if (!setObj.isScroll === true && !setObj.isShowList) {
            if (blurNum === 2 && setObj.isBlur) {
                blurNum = 1
            } else if (scrBlur) {
                setScrBlur(false);
            } else {
                setSetObj({ isShowList: true, isScroll: true, isBlur: false, isBtn: true })
                document.getElementById(idName).focus();
                setPlaCnt(inpVal)
                setInpVal('')
            }

        } else {
            if (setObj.isScroll && blurNum === 2) {
                setSetObj({ isShowList: false, isScroll: false, isBlur: false, isBtn: false })
                blurNum = 1;
            } else {
                setSetObj({ isShowList: false, isScroll: false, isBlur: false, isBtn: false })
                blurNum = 1;
            }
            getBoxHeight()

        }
    }

    /**
     * 下拉列表
     * @param {*} type 
     */
    function setSorllSta(type) {
        if (type) {
            if (blurNum === 2) {
                setSetObj({ ...setObj, isShowList: false, isScroll: true, isBlur: true })
                document.getElementById('sel' + idName).focus();
            } else {
                setSetObj({ isShowList: false, isScroll: true, isBlur: true, isBtn: false })
                blurNum = 2;
            }
        } else {
            setTimeout(() => {
                setScrBlur(true)
            }, 100);
        }

    }

    /**
     * 下拉选中项
     * @param {Object} obj 选中项 
     */
    function getSelected(obj) {
        console.log(obj)
        callback(obj)
        setSaveObj(obj);
        setInpVal(obj.name)
        setPlaCnt('')
        props.onChange(obj)
        // setIsScroll(false)
        setTimeout(() => {
            setSetObj({ isShowList: false, isScroll: false, isBlur: false, isBtn: false })
            setIsClick(false)
            blurNum = 1;
            getBoxHeight()
            return;
        }, 100);
    }

    /**
     * 下拉列表
     * @param {*} params
     * @returns
     */
    function rowRenderer(params) {
        const { index, key, style, isScrolling, parent } = params;
        const { checkData, curPerson } = parent.props;
        // console.log('list', list.length)
        return <li
            key={list[index].id}
            style={style}
            title={list[index].name}
            className={checkData === list[index].id ? 'selected' : ''}
            onClick={() => getSelected(list[index])}
        >
            {list[index].name}
        </li>

    }

    /**
     * 清除输入框
     */
    function clearIpt() {
        callback(null)
        setSaveObj(null);
        setInpVal('')
        setPlaCnt('')
        getBoxHeight()
        props.onChange({id: '', name: ''})
    }



    return <div className="lxx-g-si">
        {/* 输入框 */}
        <div className={inpVal ? 'lxx-si-g-ipt lxx-u-clear' : 'lxx-si-g-ipt'}>
            {/* {console.log(inpVal, plaCnt)} */}
            <input
                id={idName}
                value={inpVal}
                autoComplete="off"
                placeholder={ plaCnt || "请选择/搜索" }
                onChange={SearchInpt}
                // onClick={() => getFocusFun(true)}
                onFocus={() => getFocusFun(true)}
                onBlur={() => getFocusFun(false)}
            // placeholder="请选择/搜索"
            />
            <Icon 
                type="close-circle" 
                theme="filled" 
                className="lxx-u-close"
                onClick={clearIpt}
            />
            <span
                className={setObj.isScroll ? 'lxx-u-deg lxx-si-u-arr' : 'lxx-si-u-arr'}
                onClick={closeSel}></span>
        </div>

        {/* 下拉框 */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
            <div
                className={`${setObj.isScroll ? 'lxx-si-g-list a-fadeinT' : 'lxx-si-g-list'}`}
                style={setObj.isScroll ? {} : { display: 'none' }}
            >
                <div id={'sel' + idName} className="list"
                    onFocus={() => setSorllSta(true)}
                    onBlur={() => { setSorllSta(false) }}
                >
                    {/* {console.log(list.length)} */}
                    {
                        list && list.length
                            ? <List
                                width={width}
                                height={height}
                                rowCount={list.length}
                                rowHeight={32}
                                checkData={selId}
                                rowRenderer={rowRenderer}
                            />
                            : <div className="lxx-si-m-none">暂无数据</div>
                    }

                </div>
            </div>
        </div>

    </div>
}

export default SelInput;


