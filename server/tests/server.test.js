const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe("POST / todos",function(){
  it('It should create a new todo',function(done){
    let text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect(function(res){
      expect(res.body.text).toBe(text);
    })
    .end(function(e,res){
      if(e){
        return done(e);
      }

      Todo.find({text}).then(function(todos){
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch(function(e){
        done(e);
      })
    });
  });

  it('Should not create todo with invalid data',function(done){
    let text = '';
    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end(function(e,res){
      if(e){
        return done(e);
      }
      Todo.find().then(function(todos){
        expect(todos.length).toBe(2);
        done();
      }).catch(function(e){
        done(e);
      })
    })
  })
})

describe('GET / todos',function(){
  it('Should get all todos',function(done){
    request(app)
    .get('/todos')
    .expect(200)
    .expect(function(res){
      expect(res.body.todos.length).toBe(2);
    })
    .end(done)
  })
})

describe('Get /todos/:id',function(){
  it('Should return todo doc',function(done){
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect(function(res){
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  })

  it('Should return 404 if todo not found',function(done){
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  })
  it('Should return 404 for non-object ids',function(done){
    request(app)
    .get('/todos/1234')
    .expect(404)
    .end(done)
  })
})

describe('Delete /todos:id',function(){
  it('Should delete a todo',function(done){
    let hexId = todos[1]._id.toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect(function(res){
      expect(res.body.todo._id).toBe(hexId);
    })
    .end(function(e,res){
      if(e){
        return done(e)
      }
      Todo.findById(hexId).then(function(todo){

        expect(todo).toNotExist();
        done();
      }).catch(function(e){
        done(e);
      })
    })
  })
  it('Should return 404 if todo not found',function(done){
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done)
  })
  it('Should return 404 if object id is invalid',function(done){
    request(app)
    .delete('/todos/1234')
    .expect(404)
    .end(done)
  })
})

describe('Patch /todos/:id', function(){
  it('Should update the todo',function(done){
    let hexId = todos[0]._id.toHexString();
    let text = "This is a test";
    request(app)
    .patch(`/todos/${hexId}`)
    .expect(200)
    .send({
      completed: true,
      text
    })
    .expect(function(res){
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA("number")
    })
    .end(done)
  })
  it('Should clear completedAt when todo is not completed',function(done){
    let hexId = todos[1]._id.toHexString();
    let text = "This is a test";
    request(app)
    .patch(`/todos/${hexId}`)
    .expect(200)
    .send({
      completed: false,
      text
    })
    .expect(function(res){
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done)
  })
})

describe('Get /user/me',function(){

it('Should retuen user if authenticated',function(done){
  request(app)
  .get("/user/me")
  .set('x-auth', users[0].tokens[0].token)
  .expect(200)
  .expect(function(res){
    expect(res.body._id).toBe(users[0]._id.toHexString());
    expect(res.body.email).toBe(users[0].email);
  })
  .end(done)
})

it("Should return a 401 if not authenticated", function(done){
  request(app)
  .get('/user/me')
  .expect(401)
  .expect(function(res){
    expect(res.body).toEqual({});
  })
  .end(done)
})
})

describe("POST /user",function(){
  it("Should create a user",function(done){
    let email = "email@email.com";
    let password = "njpw>roh&&aaa";

    request(app)
    .post("/user")
    .send({email,password})
    .expect(200)
    .expect(function(res){
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    })
    .end(function(e){
      if(e){
        return done(e);
      }
      Users.findOne({email}).then(function(user){
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch(function(e){
        done(e);
      })
    })
  })
  it("Shoudl return validation error if request invalid",function(done){
    let email = "sdfsd";
    let password = "";
    request(app)
    .post("/user")
    .send({email,password})
    .expect(400)
    .end(done)
  })
  it("Should not create a user if email in use",function(done){
    let email = "fake@email.com";
    let password = "pass";
    request(app)
    .post('/user')
    .send({email,password})
    .expect(400)
    .end(done)
  })
})

describe("POST /user/login", function(){
  it("Should login user and return auth token",function(done){
    request(app)
    .post("/user/login")
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect(function(res){
      expect(res.header['x-auth']).toExist();
    })
    .end(function(e,res){
      if(e){
        return done(e);
      }
      Users.findById(users[1]._id).then(function(user){
        expect(user.tokens[0]).toInclude({
          access: "auth",
          token: res.headers["x-auth"]
        })
        done();
      }).catch(function(e){
        done(e);
      })
    })
  })
  it("Should reject invalid login",function(done){
    request(app)
    .post("/user/login")
    .send({
      email: users[1].email,
      password: "thisisthewrongpassword"
    })
    .expect(400)
    .expect(function(res){
      expect(res.header['x-auth']).toNotExist();
    })
    .end(function(e,res){
      if(e){
        return done(e);
      }
      Users.findById(users[1]._id).then(function(user){
        expect(user.tokens.length).toEqual(0);
        done();
      }).catch(function(e){
        done(e);
      })
    })
  })
})
