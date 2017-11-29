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

app.post('/todos',authenticate,function(req,res){
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then(function(doc){
    res.send(doc);
  },function(e){
    res.status(400).send(e);
  })
});

app.get('/todos',authenticate,function(req,res){
  Todo.find({
    _creator: req.user._id
  }).then(function(todos){
    res.send({todos})
  },function(e){
    res.status(400).send(e);
  })
})

// GET /todos/12434
app.get('/todos/:id',authenticate,function(req,res){
  let id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send('The Id was invalid!');
  }
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then(function(todo){
    if(!todo){
      return res.status(404).send('The Id was not found!');
    }
      res.send({todo})
  }).catch(function(e){
      res.status(400).send();
  })
})

app.delete('/todos/:id',authenticate,function(req,res){
  let id = req.params.id;
  console.log(`This is the id: ${id}`);
  if(!ObjectID.isValid(id)){
    return res.status(404).send('The is was invalid!')
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then(function(todo){
    if(!todo){
      return res.status(404).send();
    }
      res.send({todo});
  }).catch(function(e){
      res.status(400).send();
  })
})

app.patch('/todos/:id',authenticate,function(req,res){
  let id = req.params.id;
  let body = _.pick(req.body,['text'],['completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.complete = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  },{$set: body},{new: true}).then(function(todo){
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

app.post('/user/login',function(req,res){
let body = _.pick(req.body,['email'],['password']);

Users.findByCredentials(body.email,body.password).then(function(user){
  return user.generateAuthToken().then(function(token){
    res.header('x-auth',token).send(user);
  })
}).catch(function(e){
    res.status(400).send();
})
//res.send(body);
})

app.delete('/user/me/token',authenticate,function(req,res){
  req.user.removeToken(req.token).then(function(){
    res.status(200).send();
  },function(){
    res.status(400).send();
  })
})

app.listen(port,function(){
  console.log(`Started on at port ${port}`);
});

module.exports = {app};
