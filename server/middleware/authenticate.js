const {Users} = require('./../models/user');

let authenticate = function(req,res,next){
  let token = req.header('x-auth');

  Users.findByToken(token).then(function(user){
    if(!user){
      return Promise.reject();
    }
    req.user =user;
    req.token = token;
    next();
  }).catch(function(e){
    res.status(401).send();
  })
}

module.exports = {
  authenticate
};
