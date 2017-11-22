// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',function(err,db){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   test: 'Something to do',
  //   completed: false
  // },function(err,result){
  //   if(err){
  //     return console.log('Unable to insert todo!',err)
  //   }
  //   console.log(JSON.stringify(result.ops),undefined,2)
  // })

  // db.collection('Users').insertOne({
  //   name: 'Anthony',
  //   age: 31,
  //   location: 'Hartford'
  // },function(err,result){
  //   if(err){
  //     return console.log('Unable to insert Users',err)
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()),undefined,2);
  // })

  db.close();
});