import request from '@/utils/request'


export function createApplications(data) {
    return request({
        url: "/applications/create",
        method: 'post',
        data
    })
}
export function getApplicationsList(issuer_id) {
    return request({
        url: "/applications/issuer/" + issuer_id,
        method: 'get',
    })
}
export function getApplicationDetailById(id) {
    return request({
        url: "/applications/" + id,
        method: 'get',
    })
}
// 将申请状态更新为 rejected
export function updateApplicationStatusToRejected(id) {
    return request({
        url: "/applications/update_status/rejected/" + id,
        method: 'put',
    })
}

// 将申请状态更新为 completed
export function updateApplicationStatusToCompleted(id) {
    return request({
        url: "/applications/update_status/completed/" + id,
        method: 'put',
    })
}

// 将申请状态更新为 revoked
export function updateApplicationStatusToRevoked(id) {
    return request({
        url: "/applications/update_status/revoked/" + id,
        method: 'put',
    })
}