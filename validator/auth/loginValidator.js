const {body} = require('express-validator')

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Email Can not be Emapty'),

    body('password')
        .not().isEmpty().withMessage('Password Can not be Emapty')
]