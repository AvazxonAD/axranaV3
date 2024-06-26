const mongoose = require('mongoose')

const bossSchema = new  mongoose.Schema({
    boss: {
        type: String,
        required: true
    },
    accountant: {
        type: String,
        required: true
    }
}, {timestamps: true })

module.exports = mongoose.model("Boss", bossSchema)
