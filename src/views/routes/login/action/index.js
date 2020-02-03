//定义类型
// const loginTypes = {
//     SET_USER_INFO: 'SET_USER_INFO',
//     SET_SHOP_INFO: 'SET_SHOP_INFO' //保存用户开店状态
// };
// FIXME：命名规范起来，太随意了，eg：myActionTypes，myActionCreator
const myActionTypes = Utils.keyMirror(
    {
        SET_USER_INFO: '',
        SET_SHOP_INFO: '' //保存用户开店状态
    }
);

function _setUserInfo(obj) {
    return {
        type: myActionTypes.SET_USER_INFO,
        payload: {
            obj
        }
    };
}

function _setShopInfo(data) {
    return {
        type: myActionTypes.SET_SHOP_INFO,
        payload: {
            data
        }
    };
}

const myActionCreator = {
    setUserInfo: _setUserInfo,
    setShopInfo: _setShopInfo
};

export {myActionTypes, myActionCreator};
