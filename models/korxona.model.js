const mongoose = require('mongoose')

const korxonaSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    number: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true })

module.exports = mongoose.model("Bank", bankSchema)
