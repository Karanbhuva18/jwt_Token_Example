const mongoose = require('mongoose')
require("dotenv").config()
exports.dbconect = () =>{
    mongoose.connect(process.env.DB_URL).then(console.log("Db connect succesfully"))
    .catch((error)=>{
        console.log(error)
        process.exit(1)
    })
}