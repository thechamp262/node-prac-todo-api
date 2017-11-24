const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach(function(done){
  Todo.remove({}).then(function(){
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

      Todo.find().then(function(todos){
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
        expect(todos.length).toBe(0);
        done();
      }).catch(function(e){
        done(e);
      })
    })
  })
})
