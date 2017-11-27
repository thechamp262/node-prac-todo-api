const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'test todo 1'
},{
  _id: new ObjectID(),
  text: 'test todo 2',
  completed: true,
  completedAt: 333
}];

beforeEach(function(done){
  Todo.remove({}).then(function(){
    return Todo.insertMany(todos);
  }).then(function(){
    done();
  });
});

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
