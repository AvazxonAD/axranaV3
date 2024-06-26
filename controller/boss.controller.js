const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Boss = require('../models/boss.model')

// get boss 
exports.get = asyncHandler(async (req, res, next) => {
    const boss = await Boss.findOne()
    res.status(200).json({
        success: true,
        data: boss
    })
})

// edit boss 
exports.update = asyncHandler(async (req, res, next) => {
    const {bossName, accountantName} = req.body
    if(!bossName || !accountantName){
        return next(new ErrorResponse("sorovlar bosh qolishi mumkin emas", 403))
    }
    const boss = await Boss.findByIdAndUpdate(req.params.id, {
        boss: bossName,
        accountant: accountantName
    }, {new: true})
    
    return res.status(200).json({success: true, data: boss})
})