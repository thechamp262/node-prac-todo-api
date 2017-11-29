const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {Users} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: "fake@email.com",
  password: "password1",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
},{
  _id: userTwoId,
  email: "anotherfake@email.com",
  password: "password2",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'test todo 1',
  _creator: userOneId
},{
  _id: new ObjectID(),
  text: 'test todo 2',
  completed: true,
  completedAt: 333,
  _creator: userTwoId
}];

const populateTodos = function(done){
  Todo.remove({}).then(function(){
    return Todo.insertMany(todos);
  }).then(function(){
    done();
  });
};

const populateUsers = function(done){
  Users.remove({}).then(function(){
    let userOne = new Users(users[0]).save();
    let userTwo = new Users(users[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(function(){
    done()
  });
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
