import request from '@/utils/request'

// Create a new credential
export function registerCredential(data) {
    return request({
        url: "/credentials/register",
        method: 'post',
        data
    })
}

// Get the list of credentials for a specific holder
export function getCredentialsList(holder_id) {
    return request({
        url: "/credentials/holder/" + holder_id,
        method: 'get',
    })
}

// Get the details of a specific credential by ID
export function getCredentialDetailById(id) {
    return request({
        url: "/credentials/" + id,
        method: 'get',
    })
}