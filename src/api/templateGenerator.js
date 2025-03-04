import request from '@/utils/request'

/**
 * Generate a new credential template based on description and attribute count
 * @param {Object} data - Contains description and attribute_count
 * @returns {Promise} - Promise that resolves to the generated template
 */
export function generateTemplate(data) {
    return request({
        url: "/template-generator/generate",
        method: 'post',
        data,
        timeout: 60000 // Set specifically for this request to 60 seconds
    })
}

/**
 * Get a list of previously generated templates
 * @returns {Promise} - Promise that resolves to a list of template metadata
 */
export function getGeneratedTemplatesList() {
    return request({
        url: "/template-generator/history",
        method: 'get',
    })
}

/**
 * Get the details of a specific generated template by ID
 * @param {Number} id - The ID of the generated template
 * @returns {Promise} - Promise that resolves to the template details
 */
export function getGeneratedTemplateById(id) {
    return request({
        url: "/template-generator/history/" + id,
        method: 'get',
    })
}

/**
 * Save a generated template to the templates collection
 * This allows converting a temporarily generated template into a permanent one
 * @param {Object} data - Template data including name, issuer_id, and template_json
 * @returns {Promise} - Promise that resolves to the saved template
 */
export function saveAsTemplate(data) {
    return request({
        url: "/templates/register",
        method: 'post',
        data
    })
}
