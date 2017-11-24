let mongoose = require('mongoose');

let Users = mongoose.model('Users',{
  email:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
})

// let user = new Users({
//   email: 'anthony@anthonykroberts.com'
// })
//
// user.save().then(function(doc){
//   console.log('The new user was saved', doc)
// },function(e){
//   console.log('Unable to save new user!');
// })

module.exports = {Users};
