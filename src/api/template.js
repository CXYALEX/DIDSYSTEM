import request from '@/utils/request'


export function registerTemplate(data) {
    return request({
        url: "/templates/register",
        method: 'post',
        data
    })
}
export function getTemplateList() {
    return request({
        url: "/templates/",
        method: 'get',
    })
}
export function getTemplateDetailById(id) {
    return request({
        url: "/templates/" + id,
        method: 'get',
    })
}

// 新增：根据模板名称查询模板
export function getTemplateDetailByName(name) {
    return request({
        url: `/templates/searchbyname/${name}`,
        method: 'get',
    })
}

// 新增：根据发行者ID查询模板列表
export function getTemplateListByIssuerID(issuerId) {
    return request({
        url: `/templates/searchbyissuerid/${issuerId}`,
        method: 'get',
    })
}

export function deleteTemplateById(id) {
    return request({
        url: `/templates/${id}`,
        method: 'delete',
    })
}
