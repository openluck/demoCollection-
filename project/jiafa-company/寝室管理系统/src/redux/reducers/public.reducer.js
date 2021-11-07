/*
 * @Author: xq 
 * @Date: 2021-01-13 14:32:07 
 * @Last Modified by: xq
 * @Last Modified time: 2021-01-13 14:36:45
 */

export const initQueryString_reducer = (state = {}, { type, data }) => {
    switch (type) {
        case "INIT_PRIMARY_APP_PROPS": {
            return { ...data };
        };
        case 'DELE_PRIMARY_APP_PROPS': {
            return {  };
        }
        default: {
            return state;
        }
    }
};

export const userInfo_reducer = (state = {}, { type, data }) => {
    switch (type) {
        case "GET_USER_INFO": {
            return { ...data };
        }
        default: {
            return state;
        }
    }
};

export const buildTree_reducer = (state = [], { type, data }) => {
    switch (type) {
        case "GET_BUILD_TREE": {
            return { ...data };
        }
        default: {
            return state;
        }
    }
};

export const classesTree_reducer = (state = [], { type, data }) => {
    switch (type) {
        case "GET_CLASS_TREE": {
            return { ...data };
        }
        default: {
            return state;
        }
    }
};