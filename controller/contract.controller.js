const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Contract = require('../models/contract.model')
const Worker = require('../models/pasport.model')
const Korxona = require('../models/korxona.model')

// create conract 
exports.create = asyncHandler(async (req, res, next) => {
    const { contractDate, contractTurnOffDate, contractSumma, content, name, inn, address, accountNumber, bankName, workers, contractNumber, phone, boss } = req.body
    if (!contractDate || !contractTurnOffDate || !contractSumma || !content || !name || !inn || !address || !accountNumber || !bankName || !workers || workers.length < 1 || !contractNumber || !phone || !boss) {
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }
    if (req.query.query === 'ru') {
        console.log(req.body)
        for (let worker of workers) {
            const workerName = await Worker.findOne({ FIOkril: worker.worker})
            if(!workerName){
                return next(new ErrorResponse("server xatolik xodim topilmadi", 403))
            }
            worker.FIOlotin = workerName.FIOlotin
            worker.FIOkril = workerName.FIOkril
            worker.unvon = workerName.selectRank
            worker.tuman = workerName.selectRegion
            worker.otryad = workerName.selectOtryad
        }
    }
    if(req.query.query === 'uz') {
        for (let worker of workers) {
            const workerName = await Worker.findOne({ FIOlotin: worker.worker })
            if(!workerName){
                return next(new ErrorResponse("server xatolik xodim topilmadi", 403))
            }
            worker.FIOlotin = workerName.FIOlotin
            worker.FIOkril = workerName.FIOkril
            worker.unvon = workerName.selectRank
            worker.tuman = workerName.selectRegion
            worker.otryad = workerName.selectOtryad
        }
    }
    const newContract = await Contract.create({
        contractDate,
        contractTurnOffDate,
        contractSumma,
        content,
        name,
        inn,
        address,
        accountNumber,
        bankName,
        workers,
        contractNumber,
        phone,
        parent: req.user.id,
        boss
    })
    const korxona = await Korxona.findOne({inn: inn, parent: req.user.id})
    if(!korxona){
        await Korxona.create({
            name,
            inn,
            address,
            accountNumber,
            parent: req.user.id
        })
    }
    return res.status(200).json({
        success: true,
        data: newContract
    })
})

// get element by id 
exports.getById = asyncHandler(async (req, res, next) => {
    const contract = await Contract.findById(req.params.id)
    const result = {
        ...contract._doc,
        contractDate: contract.contractDate.toISOString().split('T')[0],
        contractTurnOffDate: contract.contractTurnOffDate.toISOString().split('T')[0]
    };
    return res.status(200).json({
        success: true,
        data: result
    })
})

// get all contract 
exports.getAllContract = asyncHandler(async (req, res, next) => {
    const contracts = await Contract.find({ parent: req.user.id })
    
    // Sanalarni formatlash
    const formattedContracts = contracts.map(contract => {
        return {
            ...contract._doc, // MongoDB ob'ektini to'g'ri olish uchun _doc dan foydalanish
            contractDate: contract.contractDate.toISOString().split('T')[0],
            contractTurnOffDate: contract.contractTurnOffDate.toISOString().split('T')[0]
        };
    });

    return res.status(200).json({
        success: true,
        data: formattedContracts
    });
});


// update contract
exports.update = asyncHandler(async (req, res, next) => {
    const contract = await Contract.findById(req.params.id)
    if(!contract){
        return next(new ErrorResponse("shartnoma topilmadi server xatolik", 403))
    }
    const { contractDate, contractTurnOffDate, contractSumma, content, name, inn, address, accountNumber, bankName, workers, contractNumber, phone } = req.body
    if (!contractDate || !contractTurnOffDate || !contractSumma || !content || !name || !inn || !address || !accountNumber || !bankName || !workers || workers.length < 1 || !contractNumber || !phone) {
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }
    for(let worker of workers){
        if(!worker.worker || !worker.dayOrHour || !worker.timeType){
            return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
        }
    }
    if (req.query.query === 'ru') {
        for (let worker of workers) {
            const workerName = await Worker.findOne({ FIOlotin: worker.worker })
            if(!workerName){
                return next(new ErrorResponse("server xatolik xodim topilmadi", 403))
            }
            worker.FIOlotin = workerName.FIOlotin
            worker.FIOkril = workerName.FIOkril
            worker.unvon = workerName.selectRank
            worker.tuman = workerName.selectRegion
            worker.otryad = workerName.selectOtryad
        }
    }
    if(req.query.query === 'uz') {
        for (let worker of workers) {
            const workerName = await Worker.findOne({ FIOlotin: worker.worker })
            if(!workerName){
                return next(new ErrorResponse("server xatolik xodim topilmadi", 403))
            }
            worker.FIOlotin = workerName.FIOlotin
            worker.FIOkril = workerName.FIOkril
            worker.unvon = workerName.selectRank
            worker.tuman = workerName.selectRegion
            worker.otryad = workerName.selectOtryad
        }
    }
    const updateContract = await Contract.findByIdAndUpdate(req.params.id, {
        contractDate: new Date(contractDate),
        contractTurnOffDate: new Date(contractTurnOffDate),
        contractSumma,
        content,
        name,
        inn,
        address,
        accountNumber,
        bankName,
        workers,
        contractNumber,
        phone
    }, { new: true })
    const korxona = await Korxona.findOne({inn: contract.inn, parent: req.user.id})
    if(korxona){
        await Korxona.findByIdAndUpdate(korxona._id, {inn: updateContract.inn}, {new: true})
    }
    return res.status(200).json({
        success: true,
        data: updateContract
    })
})

// delete contract 
exports.deleteContract = asyncHandler(async (req, res, next) => {
    await Contract.findByIdAndDelete(req.params.id)
    return res.status(200).json({
        success: true,
        data: "Delete"
    })
})

// for page 
exports.forPage = asyncHandler(async (req, res, next) => {
    let workers = null
    if (req.query.query === "uz") {
        workers = await Worker.find({ parent: req.user.id }).select("-_id FIOlotin")
        return res.status(200).json({
            success: true,
            data: workers
        })
    }
    workers = await Worker.find({ parent: req.user.id }).select("-_id FIOkril")
    return res.status(200).json({
        success: true,
        data: workers
    })
})