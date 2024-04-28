const express = require("express")

const router = express.Router()

const {signup} = require('../controller/singUp')
const {login} = require('../controller/singUp')

router.post('/singup',signup)
router.post('/login',login)

module.exports = router