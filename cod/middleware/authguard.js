const jwt = require('jsonwebtoken')
const { JWT_SCECRET } = require('../config/key')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    try{
        const authHeader = req.headers['authorization']
        if (!authHeader) {
            res.status(401).json({ error: 'you mut be logged in' })
        }
        const token = authHeader && authHeader.split(' ')[1]

        jwt.verify(token, JWT_SCECRET, (err, payload) => {
            if (err) {
                res.status(401).json({ error: 'you mut be logged in' })
            }
            if(payload.role=='Admin'){
                const { _id } = payload
                User.findById(_id).then(userdata => {
                    req.user = userdata
                    next();
                })
            }else{
                res.status(401).json({ msg: 'Access denied ' })
            }        
        })
    }catch(e){
    throw new error('Unauthorization')
    }
    
}