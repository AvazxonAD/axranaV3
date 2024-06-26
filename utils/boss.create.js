const Boss = require("../models/boss.model");


// create function 
module.exports = createBossAndAccountant = async () =>{
    const bossAndAccountant = await Boss.findOne()
    if(!bossAndAccountant){
        await Boss.create({
            boss: "Raxbar",
            accountant: "Bosh hisobchi"
        })
        return;
    }
    return;
}
