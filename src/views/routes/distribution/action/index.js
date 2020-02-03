
const disActionTypes = Utils.keyMirror(
    {
        GET_MAIL_TEMPLATE: '',
        SET_MAIL_TEMPLATE: '',
        GET_PICKUP_INFO: '',
        SET_PICKUP_INFO: ''

    }
);

function _getMailTemplate() {
    return {
        type: disActionTypes.GET_MAIL_TEMPLATE,
        payload: {
            page: 1,
            pagesize: 5,
            pageCount: -1
        }
    };
}
function _getPickupInfo() {
    return {
        type: disActionTypes.GET_PICKUP_INFO
    };
}
const disAtionCreator = {
    getMailTemplate: _getMailTemplate,
    getPickupInfo: _getPickupInfo
};

export {disActionTypes, disAtionCreator};
