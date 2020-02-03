/**
 * Epics 文件.
 */
import {combineEpics} from 'redux-observable';
import * as loginEpics from '../views/routes/login/action/epics/index';
import * as distributionEpics from '../views/routes/distribution/action/epics/index';
import * as baseEpics from './epics/index';

const epics = {
    ...baseEpics,
    ...loginEpics,
    ...distributionEpics
};
const epicsArray = [];
Object.keys(epics).forEach(epicName => {
    epicsArray.push(epics[epicName]);
});

const rootEpic = combineEpics(
    ...epicsArray
);

export {rootEpic};
