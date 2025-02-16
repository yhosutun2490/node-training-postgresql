// 總路由器
const express = require('express')
const router = express.Router()

// router module
const creditPackageRoute = require('./creditPackage')
const coachSkillRoute = require('./coachSkill')

router.use('/api/credit-package',creditPackageRoute)
router.use('/api/coaches/skill',coachSkillRoute)

module.exports = router