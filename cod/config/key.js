const dotenv=require('dotenv')
dotenv.config()

module.exports={
    JWT_SCECRET:process.env.ACCESS_TOKEN_SECRET,
   JWT_EXPIRE_IN:3000
}