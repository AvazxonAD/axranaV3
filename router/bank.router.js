const {Router} = require('express')
const router = Router()

const {protect} = require('../middleware/auth')

const {
    excel,
    createBank,
    getAllBank,
    updateBank,
    deleteBank,
    search
} = require('../controller/bank.controller')

const upload = require('../utils/upload')

router.post('/create/excel', protect,  upload.single('file'), excel)
router.get('/get', protect, getAllBank)
router.put('/update/:id', protect, updateBank)
router.post('/create', protect, createBank)
router.delete("/delete/:id", protect, deleteBank)
router.post("/search", protect, search)


module.exports = router

