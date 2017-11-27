require("./config/config");
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');

let {Todo} = require('./models/todo');
let {Users} = require('./models/user');
let {authenticate} = require('./middleware/authenticate');
      
let app = express();
const port = process.env.PORT;

const {ObjectID} = require('mongodb');

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

// GET /todos/12434
app.get('/todos/:id',function(req,res){
  let id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('The Id was invalid!');
  }
  Todo.findById(id).then(function(todo){
    if(!todo){
      return res.status(404).send('The Id was not found!');
    }
      res.send({todo})
  }).catch(function(e){
      res.status(400).send();
  })
})

app.delete('/todos/:id',function(req,res){
  let id = req.params.id;
  console.log(`This is the id: ${id}`);
  if(!ObjectID.isValid(id)){
    return res.status(404).send('The is was invalid!')
  }
  Todo.findByIdAndRemove(id).then(function(todo){
    if(!todo){
      return res.status(404).send('The id was not found!');
    }
      res.send({todo});
  }).catch(function(e){
      res.status(400).send();
  })
})

app.patch('/todos/:id',function(req,res){
  let id = req.params.id;
  let body = _.pick(req.body,['text'],['completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send('The is was invalid!')
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.complete = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set: body},{new: true}).then(function(todo){
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch(function(e){
    res.status(400).send();
  })
})


app.get('/user/me',authenticate,function(req,res){
  res.send(req.user);
});

//User code started here

app.post('/user',function(req,res){
    let body = _.pick(req.body,['email'],['password']);
    let user = new Users(body);

    user.save().then(function(){
      return user.generateAuthToken();

    }).then(function(token){
      res.header('x-auth',token).send(user)
    }).catch(function(e){
      res.status(400).send(e);
    })
});

app.listen(port,function(){
  console.log(`Started on at port ${port}`);
});

module.exports = {app};
