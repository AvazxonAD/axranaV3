const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Bank = require('../models/bank.model')
const fs = require('fs').promises; // fs.promises yordamida foydalanish
const path = require('path');
const xlsx = require('xlsx');

// get all bank 
exports.getAllBank = asyncHandler(async (req, res, next) => {
    const banks = await Bank.find({parent: req.user.id}).sort({name: 1})
    res.status(200).json({
        success: true,
        data: banks
    })
})

// excel yordamida kiritish 
exports.excel = async (req, res, next) => {
    try {
        // Faylning to'liq yo'lini olish
        const filePath = path.resolve(__dirname, '..', req.file.path);
        
        // Faylga kirish huquqini tekshirish
        await fs.access(filePath);

        // Excel faylini o'qish
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Birinchi qatorni sarlavha sifatida olish
        const jsonDataWithHeader = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        let headers = jsonDataWithHeader[0]; // Birinchi qator - sarlavhalar
        const dataRows = jsonDataWithHeader.slice(1); // Keyingi qatorlar - ma'lumotlar

        // Sarlavhalarni to'g'ri JavaScript obyektlariga o'zgartirishdan oldin bo'sh joylardan tozalaymiz
        headers = headers.map(header => header.trim());

        // Ma'lumotlarni JavaScript obyektlariga aylantirish
        const jsObjects = dataRows.map(row => {
            let obj = {};
            row.forEach((value, index) => {
                obj[headers[index]] = value;
            });
            return obj;
        });
        for(let obj of jsObjects){
            const test = await Bank.findOne({name: obj.name, parent: req.user.id})
            if(test){
                return next(new ErrorResponse(`bu bank kiritilgan excel fileni tekshiring: ${test.name}`))
            }
        }

        // Ma'lumotlarni bazaga saqlash
        for (let obj of jsObjects) {
            await Bank.create({
                name: obj.name,
                number: obj.number,
                parent: req.user.id
            });
        }

        // Javobni qaytarish
        return res.status(200).json({
            success: true,
            data: "Kiritildi"
        });

    } catch (error) {
        // Xatolik yuzaga kelganda javob qaytarish
        console.error('Xatolik:', error);
        return res.status(500).json({
            success: false,
            message: 'Faylni qayta ishlashda xatolik yuz berdi',
            error: error.message
        });
    }
};

// create bank 
exports.createBank = asyncHandler(async (req, res, next) => {
    const {banks} = req.body
    if(!banks){
        return next(new ErrorResponse("Sorovlar bosh qolishi mumkin emas", 403))
    }
    for(let bank of banks){
        if(!bank.name || !bank.number){
            return next(new ErrorResponse("Sorovlar bosh qolishi mumkin emas", 403))
        }
    }
    for(let bank of banks){
        const test = await Bank.findOne({name: bank.name, parent: req.user.id})
        if(test){
            return next(new ErrorResponse(`bu bank oldin kiritilgan: ${test.name}`))
        }
    }
    for(let bank of banks){
        await Bank.create({
            name: bank.name,
            number: bank.number,
            parent: req.user.id
        })
    }
    return res.status(200).json({
        success: true,
        data: "Kiritildi"
    })
})

// update bank 
exports.updateBank = asyncHandler(async (req, res, next) => {
    const bank = Bank.findById(req.params.id)
    const {name, number} = req.body
    if(!name, !number){
        return next(new ErrorResponse('sorovlar bosh qolishi mumkin emas', 403))
    }
    const test = await Bank.findOne({name: req.body.name, parent: req.user.id})
    if(test){
        return next(new ErrorResponse(`Bu unvon nomi kiritilgan boshqa nomga ozgartring : ${test.name}`))
    }

    await Bank.findByIdAndUpdate(req.params.id, {
        name: name,
        number: number
    }, {new : true})

    return res.status(200).json({success : true, data : "O'zgardi"})
})

// delete bank 
exports.deleteBank = asyncHandler(async (req, res, next) => {
    const deleteBank = await Bank.findByIdAndDelete(req.params.id)
    if(!deleteBank){
        return next(new ErrorResponse("ochirilmadi server xatolik",500))
    }
    return res.status(200).json({
        success: true,
        data: "Delete"
    })
})