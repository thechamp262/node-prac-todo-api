const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');


// Todo.remove({}).then(function(result){
//   console.log(result)
// })

//Todo.findOneAndRemove()
Todo.findByIdAndRemove('5a18a330f73ac2bc1cb36be0').then(function(todo){
  console.log(todo);
})
