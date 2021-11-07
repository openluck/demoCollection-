/*
 * @Author: MinJ
 * @Date: 2019-07-23 09:27:24
 * @Last Modified by: mzc
 * @Last Modified time: 2021-03-12 17:46:19
 */
const PAGEDATA = 'PAGEDATA_HOME';

const init = {
  sysName: sessionStorage.getItem('systemname') || '',
}

export function home(state = init, action) {
  switch (action.type) {
    case PAGEDATA:
      return { ...state, ...action };
    default:
      return state;
  }
}
export function seleChan( data) {
  return (dispatch, getState) => {
    // console.log(data);
    dispatch({ type: PAGEDATA, sysName: data})
  }
}
