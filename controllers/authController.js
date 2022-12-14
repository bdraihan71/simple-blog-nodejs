const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')

const User = require('../models/User')
const errorFormatter = require('../utils/validationErrorFormatter')

exports.signupGetController = (req, res, next) => {
    res.render('pages/auth/signup', {
        title: 'Create A New Account',
        error: {},
        value: {}
    })
}

exports.signupPostController = async(req, res, next) => {
    let { username, email, password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        return res.render('pages/auth/signup', {
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
        res.render('pages/auth/signup', {
            title: 'Create A New Account',
            error: {},
            value: {}
        })
    }catch (e) {
        console.log(e)
        next(e)
    }
    
}

exports.loginGetController = (req, res, next) => {
    res.render('pages/auth/login', {
        title: 'Login to Your Account',
        error:{},
        value: {}
    })
}

exports.loginPostController = async(req, res, next) => {
    let { email, password} = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    if(!errors.isEmpty()){
        return res.render('pages/auth/login', {
            title: 'Login to Your Account',
            error: errors.mapped(),
            value: {
                email
            }
        })
    }

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
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            if(err){
                console.log(err)
                return next(err)
            }
            res.redirect('/dashboard')
        })
        
    }catch (e) {
        console.log(e)
        next(e)
    }
    
}

exports.logoutController = (req, res, next) => {
    req.session.destroy( err => {
        if(err){
            console.log(err)
            return next(err)
        }
        return res.redirect('/auth/login')
    })
}