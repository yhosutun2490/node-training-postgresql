const express = require("express");
const router = express.Router();
const logger = require("../utils/logger")("CoachSkill");
const {
  createCoachesSkillValidator,
  deleteSkillValidator,
} = require("../middlewares/coachSkill/validateCoachSkill");
const {
  hasSameSkillName
} = require("../middlewares/coachSkill/index")
const {
  coachSkill
} = require("../controllers/coachSkillController")


router.get("/", coachSkill.get);

router.post("/", [createCoachesSkillValidator,hasSameSkillName], coachSkill.post);

router.delete("/:id", deleteSkillValidator, coachSkill.delete);

module.exports = router;
