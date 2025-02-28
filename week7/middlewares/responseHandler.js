

/**
 * 客製錯誤訊息
 * @param {object} res res物件 
 * @param {number} status 錯誤代碼 401/403..
 * @param {string} message 錯誤訊息
 * @returns 
 */
function customErrorResponse(res,status,message) {
    return res.status(status).json({
        status: 'failed',
        message
    })
}
/**
 * 200 成功回應
 * @param {object} res  res物件 
 * @param {object} data 回傳資料
 * @param {number} status 預設status code 200
 */
function successResponse(res,data,status=200) {
    return res.status(status).json({
        status: 'success',
        data
    })
}

module.exports = { customErrorResponse, successResponse };