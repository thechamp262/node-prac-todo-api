const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

let id = '5a18360e666ee8191f4a3baf';


Users.findById(id).then(function(user){
  if(!user){
    return console.log("User not found!");
  }
  console.log(JSON.stringify(user,undefined,2));
}).catch(function(e){
  console.log(e);
})

// let id = '5a1854d800c8e305167256bd';
//
// if(!ObjectID.isValid(id)){
//   console.log("The id is not valid");
// }

// Todo.find({
//   _id: id
// }).then(function(todos){
//   console.log("todos", todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then(function(todo){
//   console.log("todo",todo);
// });

// Todo.findById(id).then(function(todo){
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log("todo by id", todo);
// }).catch(function(e){
//   console.log(e);
// })
