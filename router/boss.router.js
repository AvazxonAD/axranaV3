const {Router} = require('express')
const router = Router()

const {protect} = require('../middleware/auth')

const {
    update,
    get
} = require('../controller/boss.controller')

router.get('/get', protect, get)
router.put("/update/:id", protect, update)

module.exports = router

