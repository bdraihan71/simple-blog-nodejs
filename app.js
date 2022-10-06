const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash');
const MongoDBStore = require('connect-mongodb-session')(session);


//import routes
const authRoutes = require('./routes/authRoute')
const dashboardRoutes = require('./routes/dashboardRoute')

//import middleware
const { bindUserWithRequest } = require('./middleware/authMiddleware')
const setLocals = require('./middleware/setLocals')

const app = express()

const MONGODB_URI = 'mongodb://localhost:27017/simple-blog'
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

//setup view engine
app.set('view engine', 'ejs')
app.set('views', 'views')


//middleware array
const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        },
        store: store
    }),
    bindUserWithRequest(),
    setLocals()
]

app.use(middleware)

app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)

app.get('/', (req, res) => {
    res.json({
        message: 'Hello Raihan'
    })
})

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGODB_URI);
}

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})