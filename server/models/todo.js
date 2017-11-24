let mongoose = require('mongoose');

let Todo = mongoose.model('Todo',{
  text:{
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  }
});



// let newTodo = new Todo({
//   text: 'Cook dinner'
// });

// let newTodo = new Todo({
//   text: '     Edit code      '
// });
//
// newTodo.save().then(function(doc){
//   console.log('Saved Todo', doc);
// },function(e){
//   console.log('unable to save Todo');
// });

module.exports = {Todo};
