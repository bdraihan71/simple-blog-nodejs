const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

//import routes
const authRoutes = require('./routes/authRoute')

const app = express()

//setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')


//middleware array
const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json()
]

app.use(middleware)

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
    res.json({
        message: 'Hello Raihan'
    })
})

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/simple-blog');
}

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})