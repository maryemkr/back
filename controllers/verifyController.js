const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Verify user id
module.exports.verify = async (req, res, next) => {
    const token = req.headers.authorization

   
    console.log(token);
    
    if (!token) return res.status(401).send('Access Denied')
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        const user = await User.findById(verified._id)
        if(!user) {
            return res.status(400).send('user not found')
        }
        req.user = user
        next()
    }catch(err){
      return res.status(400).send('invalid token')
    }
}
module.exports.ADMO = async (req, res, next) => {
  let token = req.headers.authorization
  let role = req.headers.role
 
  //console.log(token);
  
  if (!token || role!="ADMO") return res.status(401).send('Access Denied')
  try{
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      const user = await User.findById(verified._id)
      if(!user) {
          return res.status(400).send('user not found')
      }
      req.user = user
      next()
  }catch(err){
    return res.status(400).send('invalid token')
  }
}
module.exports.ADMMB = async (req, res, next) => {
  let token = req.headers.authorization
  let role = req.headers.role
   
  if (!token || role !="ADMMB" ) return res.status(401).send('Access Denied')
  try{
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      const user = await User.findById(verified._id)
      if(!user) {
          return res.status(400).send('user not found')
      }
      req.user = user
      next()
  }catch(err){
    return res.status(400).send('invalid token')
  }
}




//Manage roles
exports.restrictTo = (...roles) => {

    return (req, res, next) => {
      console.log(req.user)
      if (!roles.includes(req.headers.role)) {
        return res.status(400).send('invalid role')
      }
      
      next();
    };
  };
