/**
 *  接口地址
 */
const {systemApi} = Utils;
const href = {
    // 测境
    dev: {
        apiPath: 'https://csapi.zzha.vip/manage',
        feedback: 'https://cs.zzha.vip/site/feedback'
    },
    test: {
        apiPath: 'https://csapi.zzha.vip/manage',
        webIm: 'https://csapi.zzha.vip/teim',
        feedback: 'https://cs.zzha.vip/site/feedback'
    },
    // 预生产环境
    preProd: {
        apiPath: 'https://yapi.zzha.vip/manage',
        webIm: 'https://yapi.zzha.vip/teim',
        feedback: 'https://ywww.zzha.vip/site/feedback'
    },
    // 生产环境
    production: {
        apiPath: 'https://api.zzha.vip/manage',
        webIm: 'https://api.zzha.vip/teim',
        feedback: 'https://www.zzha.vip/site/feedback'
    },
    // 本地环境
    mock: {
        // rootPath: 'https://www.easy-mock.com/mock/5d142ff201cdd21b233eca70/mock'
    }
};
const currentHref = (function () {
    let url;
    if (systemApi.isProdEnv()) {
        url = href.production;
    } else if (systemApi.ispreProdEnv()) {
        url = href.preProd;
    } else {
        url = href.dev;
    }
    return url;
}());

export default currentHref;
