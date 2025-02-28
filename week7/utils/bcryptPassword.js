const bcrypt = require("bcrypt");

/**
 * 將密碼以 bcrypt 加密
 * @param {string} input - 使用者輸入的純文字密碼
 * @returns {Promise<string>} - 加密後的密碼哈希值
 * @throws {Error} - 當 bcrypt 發生錯誤時拋出錯誤
 */
async function hashPassword(input) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(input, salt);
    return hashPassword;
  } catch (err) {
    throw new Error("hashPassword加密有誤");
  }
}

/**
 * 比較輸入的密碼與資料庫中儲存的hash是否匹配
 * @param {string} input - 使用者輸入的密碼
 * @param {string} databasePassword - 資料庫中儲存的加密密碼
 * @returns {Promise<boolean>} - 如果匹配回傳 `true`，否則回傳 `false`
 * @throws {Error} - 當 bcrypt 發生錯誤時拋出錯誤
 */
async function comparePassword(input, databasePassword) {
  try {
    const isMatch = await bcrypt.compare(input, databasePassword);
    return isMatch;
  } catch (err) {
    console.log('err',err)
    throw new Error("comparePassword有誤");
  }
}

module.exports = {
  hashPassword,
  comparePassword,
};
