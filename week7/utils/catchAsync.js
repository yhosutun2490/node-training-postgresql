/**
 * handle 路由controller error
 * @param {function} fn router controller function 
 * @returns {function} Express middleware function 接收res/req/next參數
 */

const catchAsync =  (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
  
module.exports = catchAsync;