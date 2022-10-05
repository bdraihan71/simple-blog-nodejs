const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

const User = require('../models/User')
const errorFormatter = require('../utils/validationErrorFormatter')

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup.ejs', {
        title: 'Create A New Account',
        error: {},
        value: {}
    })
}

exports.signupPostController = async(req, res, next) => {
    let { username, email, password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        return res.render('pages/auth/signup.ejs', {
            title: 'Create A New Account',
            error: errors.mapped(),
            value: {
                username, email, password
            }
        })
    }


    try {
        let hashedPassword = await bcrypt.hash(password, 10)

        let user = new User({
            username,
            email,
            password: hashedPassword
        })

        let createduser = await user.save()
        res.render('pages/auth/signup.ejs', {
            title: 'Create A New Account'
        })
    }catch (e) {
        console.log(e)
        next(e)
    }
    
}

exports.loginGetController = (req, res, next) => {
    res.render('pages/auth/login.ejs', {
        title: 'Login to Your Account'
    })
}

exports.loginPostController = async(req, res, next) => {
    let { email, password} = req.body
    console.log(req.body)

    try {
        let user = await User.findOne({email})
        if(!user) {
            return res.json({
                message: 'Invalid Credential'
            })
        }

        let match = await bcrypt.compare(password, user.password)
        if(!match) {
            return res.json({
                message: 'Invalid Credential'
            })
        }
        console.log('Successfully Logged In', user )
        res.render('pages/auth/login.ejs', {
            title: 'Login to Your Account'
        })
    }catch (e) {
        console.log(e)
        next(e)
    }
    
}