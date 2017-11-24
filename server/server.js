let express = require('express');
let bodyParser = require('body-parser');


let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {Users} = require('./models/user');

let app = express();

app.use(bodyParser.json());

app.post('/todos',function(req,res){
  let todo = new Todo({
    text: req.body.text
  });
  todo.save().then(function(doc){
    res.send(doc);
  },function(e){
    res.status(400).send(e);
  })
});

app.get('/todos',function(req,res){
  Todo.find().then(function(todos){
    res.send({todos})
  },function(e){
    res.status(400).send(e);
  })
})

app.listen(3000,function(){
  console.log('Started on port 3000');
});

module.exports = {app};
