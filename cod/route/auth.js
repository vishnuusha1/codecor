const express = require('express')
const router = require('express').Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SCECRET, JWT_EXPIRE_IN } = require('../config/key')
const authguard = require('../middleware/authguard')
const { loginValidation } = require('../validator/validation')
const { registerValidation } = require('../validator/validation')
const { validPassword } = require('../validator/validation')
const { hashPassword } = require('../validator/helper')
const { checkEmail } = require('../validator/validation')
const dotenv = require('dotenv')


/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post("/signup", async (req, res) => {

  const { error } = await registerValidation(req.body);
  console.log(error);

  if (error) return res.status(400).json(error.details[0].message);
  const userexist = await checkEmail(req.body.email);
  if (userexist) return res.status(400).send(" email already exist");

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await hashPassword(req.body.password, salt);

  const user = new User();
  user["name"] = req.body.name;
  user["password"] = hashedpassword;
  user["email"] = req.body.email;
  user["role"] = req.body.role;

  try {
    const Data = await user.save();

    return res.send({ Data });
  } catch (err) {
    return res.status(502).json({ message: err });
  }
});



/**
 * @method - POST
 * @param - /login
 * @description - User Login
 */

router.post("/login", async (req, res) => {
  console.log(req.body, "hloo");
  const { error } = await loginValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  const user = await checkEmail(req.body.email);

  if (!user) return res.status(400).send("invalid email");
  const validpassword = await validPassword(req.body.password, user.password);

  if (!validpassword) return res.status(400).send("invalid password");
  try {
    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SCECRET, { expiresIn: JWT_EXPIRE_IN });
    const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${JWT_EXPIRE_IN}s`;

    return res.header('Set-Cookie', token).json({ token: token })
  } catch (err) {
    return res.status(502).json({ message: 'invalid email or password' });
  }
});


/**
 * @method - GET
 * @param - /all-user
 * @description - Get all user
 */


router.get('/all-user', authguard, (req, res) => {
   try{
    User.find(function (err, user) {
      if (err) return console.error(err);
        if(!user)  return res.status(200).json({ message: 'No result' });
        return res.status(200).json({ Data:user});
       }
    )
    }catch(err){
      console.error(err);
      throw new httpexception(err)
   }
})

module.exports = router 