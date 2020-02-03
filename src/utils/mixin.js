/**
 * Created by locke on 17/10/28.
 * @desc 混合工具函数
 */
import {message} from 'antd';
import moment from 'moment';
import {saveAs} from 'file-saver';
import {systemApi} from './systemApi';

// const {getShopInfo} = Utils;

//全局配置message
message.config({
    maxCount: 1
});

// 错误提示
export function errorType(data) {
    message.info(data.message);
    return ({
        type: null
    });
}

export const keyMirror = (obj) => {
    let key;
    const mirrored = {};
    if (obj && typeof obj === 'object') {
        for (key in obj) {
            if ({}.hasOwnProperty.call(obj, key)) {
                mirrored[key] = key;
            }
        }
    }
    return mirrored;
};

/**
 * 生成 reducer 函数.
 *
 * @param {Object} initialState
 * @param {Object} handlers
 * @returns {function}
 */
export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if ({}.hasOwnProperty.call(handlers, action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
}

// 生成num长度的有序数组 num: 传入数字 生成时间
export function getTime(num, type = '') {
    return Array.from({length: num}, (v, k) => {
        if (k < 10 && !type) {
            k = '0' + k;
        }
        return (k + type).toString();
    });
}

// 获取url参数
export function getUrlParam(name, str) {
    str = str || '';
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); //构造一个含有目标参数的正则表达式对象
    const r = str.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null;
}


//获取日期函数，num传几就是往后延期多少天，不传默认获取当天  xxxx-xx-xx;
export const getFormatDate = (num = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + num);
    const seperator1 = '-';
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    const currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

//时间日期选择，转化为阿拉伯数字
export const formatMoment = (form) => {
    const data = moment(form.format('YYYY-MM-DD')).valueOf();
    const datetime = new Date(data);
    const seperator1 = '-';
    const year = datetime.getFullYear();
    let month = datetime.getMonth() + 1;
    let strDate = datetime.getDate();
    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    const currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

const addZear = (num) => ((num > 0 && num < 9) ? '0' + num : num);
//时间选择，转化为阿拉伯数字  00:00
export const formatMomentSecond = (form) => {
    const data = moment(form.format('YYYY-MM-DD HH:mm:ss')).valueOf();
    const datetime = new Date(data);
    const seperator1 = ':';
    let strHours = datetime.getHours();
    let minute = datetime.getMinutes();
    strHours = addZear(strHours);
    minute = addZear(minute);
    const currentdate = strHours + seperator1 + minute;
    return currentdate;
};


//成功提示
export const successMsg = (info, duration = 2, onClose = null) => {
    message.success(info, duration, onClose);
};

//警告提示
export const warningMsg = (info, duration = 2, onClose = null) => {
    message.warning(info, duration, onClose);
};

//错误提示
export const showFail = (info, duration = 2, onClose = null) => {
    message.error(info, duration, onClose);
};

//帮助提示
export const showInfo = (info, duration = 2, onClose = null) => {
    message.info(info, duration, onClose);
};

// base64 转文件
export function b64toFile(b64Data, filename, contentType) {
    const sliceSize = 512;
    const byteCharacters = atob(b64Data.substring(b64Data.indexOf(',') + 1));
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const file = new File(byteArrays, filename, {type: contentType});
    return file;
}

// excel下载
export function downloadExcel(data, name) {
    if (!data) return;
    const uid = JSON.parse(systemApi.getValue('users')).no;
    const file = b64toFile(data, `${uid}_${name}`, 'application/vnd.ms-excel;charset=utf-8');
    console.log('file', file);
    saveAs(file);
}

export function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] === variable) { return pair[1] }
    }
    return (false);
}

// 函数节流
export function throttle(handler, wait) {
    let lastTime = 0;
    return function (...args) {
        const nowTime = new Date().getTime();
        if (nowTime - lastTime > wait) {
            handler.apply(this, args);
            lastTime = nowTime;
        } else {
            console.log('请勿频繁点击！');
        }
    };
}

// 函数防抖
export function debounce(handler, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            handler.apply(this, args);
        }, delay);
    };
}

// 对象数组去重
export function removeRepeat(arr, key) {
    if (arr.length === 0) {
        return arr;
    }
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i][key] === arr[j][key]) {
                arr.splice(j, 1);
                j -= 1;
            }
        }
    }
    return arr;
}

//图片上传前判断
export function checkImageWH(file, tarWidth, tarHeight, imgMem) { //文件，宽，高，内存大小
    let imgSize = false;//判断图片尺寸是否合格
    return new Promise(((resolve, reject) => {
        const filereader = new FileReader();
        filereader.onload = e => {
            const src = e.target.result;
            const image = new Image();
            image.onload = function () {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    warningMsg('请上传图片格式文件!');
                }
                const isLt2M = file.size / 1024 / 1024 < Number(imgMem);
                if (!isLt2M) {
                    warningMsg(`请上传大小为${Number(imgMem) * 1000}以内的图片!`);
                }
                if ((tarWidth !== this.width) ||  (this.height !== tarHeight)) {
                    warningMsg(`文件尺寸应为：${tarWidth}*${tarHeight}！`);
                } else {
                    imgSize = true;
                }
                if (isJpgOrPng && isLt2M && imgSize) { //三个条件都满足
                    resolve();
                } else {
                    reject();
                }
            };
            image.onerror = reject;
            image.src = src;
        };
        filereader.readAsDataURL(file);
    }));
}

//上传图片前检测图片类型与大小
export function beforeUpload(file, imgSize) {
    let imgRight = false;//判断图片尺寸是否合格
    return new Promise(((resolve, reject) => {
        const filereader = new FileReader();
        filereader.onload = e => {
            const src = e.target.result;
            const image = new Image();
            image.onload = function () {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    warningMsg('请上传图片格式文件!');
                }
                const isLt2M = file.size / 1000 / 1000 < Number(imgSize);
                if (!isLt2M) {
                    warningMsg(`请上传大小为${Number(imgSize) * 1000}k以内的图片!`);
                } else {
                    imgRight = true;
                }
                if (isJpgOrPng && isLt2M && imgRight) { //三个条件都满足
                    resolve();
                } else {
                    reject();
                }
            };
            image.onerror = reject;
            image.src = src;
        };
        filereader.readAsDataURL(file);
    }));
}

//图片转格式
export function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

//商品管理图片上传前验证
export function normFile(e) {
    const file = e.file; //当前操作的文件对象
    const fileList = e.fileList; //当前的文件列表
    //判断e
    if (Array.isArray(e)) {
        return e;
    }
    if (file.status !== 'removed') {
        //只在添加图片的时候判断
        //判断类型
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            showFail('错误的图片格式');
            return fileList.filter((fileItem) => file.uid !== fileItem.uid); //移除fileList里的错误图片
        }
        //判断大小
        const isSize = file.size / 1024 / 1024 < 2;
        if (!isSize) {
            showFail('图片大小不能超过2M');
            return fileList.filter((fileItem) => file.uid !== fileItem.uid);
        }
    }
    return fileList;
}

//前往im
export function tengXunIm(type, no = '', ground, groundNmae, url) {
    const time = new Date();
    window.open(`./im/im.html?${time}=${type}=${no}=${ground}=${groundNmae}=${url}=', '_blank', 'width=850px,height=810px,scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes`);
}