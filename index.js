const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient
// const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://benjimen:richards@cluster0.36l95.mongodb.net/<dbname>?retryWrites=true&w=majority"
const port = process.env.PORT || 1111
const path = require('path')
const collection_name = 'blog'

const app = express()
const session = require('express-session')
const postrouter = require('./src/Routers/Postrouter')
const adminrouter = require('./src/Routers/adminRouterpage')
const loginrouter = require('./src/Routers/loginRouter')


let database

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//static files

const staticpath = path.join(__dirname, "./public")
const viewpath = path.join(__dirname, "./src/views")
// console.log(staticpath)
app.use(express.static(staticpath))
app.set("views", viewpath)
app.set("view engine", "ejs")

//generate token

app.use('/health', (req, res) => {
    res.send('Health ok')
})
app.use(session({
    secret: 'mylogintoken'
}))

//Routes

app.get('/', (req, res) => {
    let message = req.query.message ? req.query.message : ''
    return res.render("login", { message })
})
//Post router
app.use('/post', postrouter)
app.use('/admin', adminrouter)
app.use('/login', loginrouter)

// connecting to mongodb
mongoClient.connect(mongourl, (err, connection) => {
    database = connection.db('benjimen')
    app.listen(port, (err, result) => {
        if (err) console.log('Cannot cannot to database')
        console.log('Connection successful on', port)
    })
})