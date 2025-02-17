const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachSkill");
const { userSignUpValidator } = require("../validation/user");
const {
  successResponse,
  customErrorResponse,
  serverErrorResponse,
} = require("../middlewares/responseHandler");

router.post('/coaches/:userId',async(req, res, next)=>{
    try {

    } catch(err) {
        serverErrorResponse(res)
    }
})

module.exports = router