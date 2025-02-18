const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const logger = require("../utils/logger")("CoachSkill");
const {
  createCoachesSkillValidator,
  deleteSkillValidator,
} = require("../validation/validation");
const {
  customErrorResponse,
  successResponse,
  serverErrorResponse,
} = require("../middlewares/responseHandler");

router.get("/", async (req, res, next) => {
  try {
    const data = await dataSource.getRepository("Coach_Skill").find({
      select: ["id", "name"],
    });
    successResponse(res, data);
  } catch (err) {
    console.log("err", err);
    serverErrorResponse(res);
  }
});

router.post("/", async (req, res, next) => {
  try {
    // 檢核 body
    const bodyData = req.body;
    createCoachesSkillValidator(bodyData);

    // get datasource insert
    const { name } = bodyData;
    const skillTable = await dataSource.getRepository("Coach_Skill");

    // 檢核package 名稱
    const hasSameSkillName = await skillTable.findOne({
      where: { name },
    });

    if (!hasSameSkillName) {
      const result = await skillTable.insert({
        name: name,
      });
      const createId = result.identifiers[0]?.id;
      successResponse(res, {
        id: createId,
        name,
      });
    } else {
      throw new Error("repeat_name");
    }
  } catch (err) {
    if (err.name === "ZodError") {
      customErrorResponse(res, 403, "欄位未填寫正確");
    } else if (err.message == "repeat_name") {
      customErrorResponse(res, 409, "資料重複");
    } else {
      serverErrorResponse(res);
    }
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const targetId = req.params?.id;
    // id 格式檢核
    deleteSkillValidator({ id: targetId });
    const skillTable = await dataSource.getRepository("Coach_Skill");
    const result = await skillTable.delete({
      id: targetId,
    });

    if (result.affected) {
      successResponse(res, result);
    } else {
      throw new Error("id_not_found");
    }
  } catch (err) {
    if (err.message === "id_not_found") {
      customErrorResponse(res, 400, "ID錯誤");
    } else if (err.name === "ZodError") {
      customErrorResponse(res, 403, "ID未填寫正確");
    } else {
      serverErrorResponse(res);
    }
  }
});

module.exports = router;
