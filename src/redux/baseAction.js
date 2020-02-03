/**
 * @desc base --actionTypes、actionCreator定义,调用actionCreator函数返回action对象或函数
 * @returns {baseActionTypes, baseActionCreator}
 */


const baseActionTypes = Utils.keyMirror({
    SET_USER_TOKEN: '',
    SET_NUM_TIMEOUT: '',
    SET_CRITERION: '',
    GET_CRITERION: ''
});


//userToken
function _setUserToken(userToken) {
    return {
        type: baseActionTypes.SET_USER_TOKEN,
        payload: {
            userToken
        }
    };
}


function _setNumTimeOut(num) {
    return {
        type: baseActionTypes.SET_NUM_TIMEOUT,
        payload: {
            num
        }
    };
}

//保存协议
function _getCriterion(data) {
    return {
        type: baseActionTypes.GET_CRITERION,
        payload: {
            data
        }
    };
}

function _setCriterion(data) {
    return {
        type: baseActionTypes.SET_CRITERION,
        payload: {
            data
        }
    };
}
const baseActionCreator = {
    setUserToken: _setUserToken,
    setNumTimeOut: _setNumTimeOut,
    setCriterion: _setCriterion,
    getCriterion: _getCriterion
};


export {baseActionTypes, baseActionCreator};
