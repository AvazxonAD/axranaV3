const mongoose = require('mongoose')

const korxonaSchema = new  mongoose.Schema({
    inn: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    adress: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true })

module.exports = mongoose.model("Korxona", korxonaSchema)
