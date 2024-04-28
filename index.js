const express = require('express')

const cookieParser = require('cookie-parser')
const app = express()
require('dotenv').config()
app.use(express.json())
app.use(cookieParser())

const router = require('./router/userrouter')
app.use('/singup/api',router)

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`app is running on port no ${PORT}`)
})

const dbconnection = require("./config/database")
dbconnection.dbconect();



