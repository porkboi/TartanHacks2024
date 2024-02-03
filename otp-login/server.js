const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var cors = require('cors')


require('dotenv').config()
const PORT = 3080


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
  }));


//calling Database function
require('./config/database').connect()

//route importing and mounting
const user = require('./routes/user')

app.use('/api/v1', user)


app.listen(PORT, ()=>{
    console.log("Server Started", PORT)
   
})