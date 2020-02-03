

const openShopType = Utils.keyMirror({
    SET_SHOPDATA: ''
});

function _setShopData(obj) {
    return {
        type: openShopType.SET_SHOPDATA,
        payload: {
            obj
        }
    };
}
const openShopActionCreator = {
    setShopData: _setShopData
};

export {openShopType, openShopActionCreator};