/**
 * 500伺服器錯誤
 * @param {object} res res物件 
 * @returns 
 */
function serverErrorResponse(res) {
    return res.status(500).json({
        status: "error",
        message: "伺服器錯誤"
    })
}

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
 * @param {*} data 回傳資料
 * @param {*} message 回傳訊息
 */
function successResponse(res,data) {
    return res.status(200).json({
        status: 'success',
        data
    })
}

module.exports = { serverErrorResponse, customErrorResponse, successResponse };