/**
 * 產生錯誤物件err object
 * @param {number} status status code  
 * @param {string} message 錯誤訊息 
 * @returns 
 */

function generateError (status , message) {
    const error = new Error(message)
    error.status = status
    return error
}

module.exports = {
    generateError
}