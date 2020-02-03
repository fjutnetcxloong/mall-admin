/**
 * 埋点数据
 */
import {systemApi} from './systemApi';

const basekv = {
    xuid: systemApi.getValue('xuid') || '',
    tel: systemApi.getValue('activiedMobile') || '',
    acc: systemApi.getValue('loginAcc') || ''
};

export const Td = {
    log: (eventId, label = '', kv = {}) => {
        const newKv = Object.assign({}, basekv, kv);
        if (systemApi.isCordovaEnv()) {
            // TDAPP.onEvent(eventId, label, newKv);
        } else {
            systemApi.log(eventId + '-----' + label);
            systemApi.log(newKv);
        }
    }
};