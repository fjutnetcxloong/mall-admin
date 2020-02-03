import * as validator from './validator';

export {systemApi} from './systemApi';
export {
    keyMirror, createReducer,
    getFormatDate, formatMoment, downloadExcel,
    successMsg, warningMsg, showFail, showInfo,
    formatMomentSecond, getQueryVariable,
    throttle, debounce, removeRepeat, checkImageWH,
    normFile, beforeUpload, getBase64, getUrlParam,
    getTime, tengXunIm, b64toFile
} from './mixin';
export {validator};

export {appHistory} from './appHistory';
export {getShopInfo} from './getShopInfo';
export {Td} from './Td';
