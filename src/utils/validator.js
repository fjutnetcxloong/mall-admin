/**
 * @desc 表单验证公用函数
 */
/* eslint-disable no-restricted-globals*/
/* eslint-disable  no-useless-escape */
// 验证手机号
export function checkPhone(phone) {
    phone = Number(phone);
    return /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(phone);
}
// 验证固定电话
export function checkLandline(value) {
    return /^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/.test(value);
}

// 验证邮箱
export function checkEmail(value) {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
}

// 验证区间值
export function checkMinMax(value, vMin, vMax) {
    vMin = parseFloat(vMin);
    vMax = parseFloat(vMax);
    value = parseFloat(value);
    const minFlag = isNaN(vMin) ? true : vMin <= value;
    const maxFlag = isNaN(vMax) ? true : vMax >= value;
    return minFlag && maxFlag;
}

//验证统一社会信用代码
export function creditCode(value) {
    return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{1,18}$/.test(value);
}

// 验证字符串长度区间
export function checkStr(value, minLen, maxLen) {
    return /^\S+/.test(value) && checkMinMax(value.length, minLen, maxLen);
}

// 整数区间
export function checkInt(value, vMin, vMax) {
    value = Number(value);
    return /^[-\+]?\d+$/.test(value) && checkMinMax(value, vMin, vMax);
}

export function checkFloat(value, vMin, vMax) {
    return /^[-\+]?\d+(\.\d+)?$/.test(value) && checkMinMax(value, vMin, vMax);
}

// 验证字母
export function checkEN(value) {
    return /^\w+$/.test(value);
}

// 验证是否汉字
export function checkCN(strValue) {
    return /.*[\u4e00-\u9fa5]+.*$/.test(strValue);
}

/**
 * @return {boolean}
 */

//只能输入中文和英文
export function CNandEN(value) {
    return /^[a-zA-Z\u4e00-\u9fa5]+$/.test(value);
}

// 判断是数字且不能输入空格
export function isNum(numValue) {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    return  reg.test(numValue);
}

//判断只能输入数字和英文
/**
 * @return {boolean}
 */
export function NumAndEN(value) {
    return /^[0-9a-zA-Z]+$/.test(value);
}
// 去掉汉字
export function removeCN(strValue) {
    if (strValue !== null && strValue !== '') {
        const reg = /[\u4e00-\u9fa5]/g;
        return strValue.replace(reg, '');
    }
    return '';
}

// 只提取汉字
export function getCN(strValue) {
    if (strValue !== null && strValue !== '') {
        const reg = /[\u4e00-\u9fa5]/g;
        if (strValue.match(reg)) return strValue.match(reg).join('');
        return '';
    }
    return '';
}

// 验证小数位
export function checkDigits(numValue, len) {
    const re = /^[0-9]+.?[0-9]*$/;
    if (re.test(Number(numValue))) {
        const dis = numValue.toString().split('.')[1];
        if (dis) {
            if (dis.length <= len) return true;
            return false;
        }
        return true;
    }
    return false;
}

//验证密码是否合适(8~20位)
export function checkPassWord(min, max, str) {
    const regex = new RegExp(`^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{${min},${max}}$`);
    return regex.test(str);
}

// 保留小数点后几位
export function toFixed(strValue, num) {
    const re = new RegExp('([0-9]+.[0-9]{' + num + '})[0-9]*', 'g');
    return strValue.replace(re, '$1');
}

// 判断是否是整数类型
export function isInteger(obj) {
    //是整数，则返回true，否则返回false
    return typeof obj === 'number' && obj % 1 === 0;
}

// 判断是数字且位数
export function floatType(numValue, len) {
    const re = /^[0-9]+.?[0-9]*$/;
    if (re.test(Number(numValue))) {
        const dis = numValue.toString().split('.')[1];
        if (dis) {
            if (dis.length <= len) return true;
            return false;
        }
        return true;
    }
    return false;
}

// 判断是否n的倍数
export function multipleIntenger(num, mul) {
    return Number(num) % mul === 0;
}

//限制是数字
export function  numLimit(value) {
    return /^\d+$/.test(value);
}

//身份证号验证
export function ID(num) {
    return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(num);
}

//检验4位验证码
export function authCode(value) {
    return /^\d{4}$/.test(value);
}
//银行卡号验证
export function bankCard(num) {
    return /^\d{15,20}$/.test(num);
}

//uid验证
export function UID(num) {
    const reg = /^[1-9]\d*$/;
    if (reg.test(num)) {
        return Number(num) >= 9921;
    }
    return false;
}
//判断字符串、对象、数组、是否为空,判断bool型
export function isEmpty(value, message, callback) {
    const type =  Object.prototype.toString.call(value);
    let arrayVerify = false;
    let objectVerify = false;
    //判断数字
    const numberVerify = type.indexOf('Number') !== -1 && !value;
    //判断字符串
    const stringVerify = type.indexOf('String') !== -1 && !value;
    //判断bool型
    const boolVerify = type.indexOf('Boolean') !== -1 && !value;
    //判断数组
    if (type.indexOf('Array') !== -1) {
        arrayVerify = value.some(item => item === '');
    }
    //判断对象
    if (type.indexOf('Object') !== -1) {
        objectVerify = JSON.stringify(value) === '{}';
    }
    if (stringVerify || arrayVerify || objectVerify || boolVerify || numberVerify) {
        callback(message);
        return false;
    }
    return true;
}

//提示语
export function showMessage(message, callback) {
    callback(message);
}

//判断两个字符串是否相等
export function isEqual(value1, value2, message, callback) {
    if (value1 !== value2) {
        callback(message);
        return false;
    }
    return true;
}

//正则表达式验证
export const regExp = new Map([
    ['any', /^\S.{0,30}\S$/], //非空格的任意字符
    ['amount', /^((0)|([1-9]{1}\d{0,7}))(\.{0,1}\d{1,2})?$/], //金额 0~99999999.99
    ['discount', /^([8-9]{1})(\.{0,1}\d{1,2})$/], //折扣 8~9.5
    ['stock', /^\d+$/] //输入商品库存
]);
