import {get } from "../utils/axios";

export function getUser(username) {
    return get('/JIRAUser/getUser', { username });
}

export function getProject(projectIdOrKey) {
    return get('/JIRAProject/getProject', { projectIdOrKey });
}

export function getAllBoard(projectKeyOrId) {
    return get('/JIRABoard/getAllBoard', { projectKeyOrId });
}
export function getAllFutureSprint(boardId) {
    return get('/JIRASprint/getAllFutureSprint', { boardId });
}
export function getPlanningResult(params) {
    return get('/JIRAPlanning/getPlanningResult', params);
}
export function getWorklogData(params) {
    return get('JIRAWorklog/getWorklogForUserByProjectAndRange', params);
}
export function getJIRAVersionDelivery(projectIdOrKey) {
    return get('JIRAVersionDelivery/getVersionDelivery', { projectIdOrKey });
}
export function getEPICByProjestAndVersionDelivery(params) {
    return get('JIRAIssue/getEPICByProjestAndVersionDelivery', params);
}
export function getEPICEstimate(params) {
    return get('JIRAIssue/getEPICEstimate', params);
}