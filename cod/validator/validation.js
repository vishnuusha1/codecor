const Joi=require('@hapi/joi')
const mongoose=require('mongoose')
const User=mongoose.model('User')
const bcrypt=require('bcryptjs')


const loginValidation=(data)=>{

    const loginSchema=Joi.object({
        email:Joi.string().email().required(),
        password: Joi.string().min(4).max(8).required(),
        
    }) 
    return loginSchema.validate(data)
}
const registerValidation=(data)=>{
    const registerSchema=Joi.object({
        name:Joi.string().required(),
        email:Joi.string().required(),
        password: Joi.string().min(6).max(8).required(),
        role:Joi.string().valid('Admin','User').required()
        
    }) 
    return registerSchema.validate(data)
}
    
const checkEmail = async (email) => {
    return await User.findOne({ email: email });
  };

  const validPassword = async (password, userpassword) => {
    const data = await bcrypt.compare(password, userpassword);
    return data;
  
    
  };


module.exports.checkEmail=checkEmail
module.exports.validPassword=validPassword
module.exports.loginValidation=loginValidation
module.exports.registerValidation=registerValidation