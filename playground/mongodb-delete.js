// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',function(err,db){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //deleteMany
  // db.collection('Todos').deleteMany({text: "Eat lunch"}).then(function(result){
  //   console.log(result);
  // })

  //deleteOne

  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then(function(result){
  //   console.log(result);
  // })

  //findOneAndDelete

  // db.collection('Todos').findOneAndDelete({completed: false}).then(function(result){
  //   console.log(result);
  // })

  // db.collection('Users').deleteMany({name: 'Anthony'}).then(function(result){
  //   console.log(result);
  // })

  db.collection('Users').deleteOne({_id: new ObjectID('5a15cc0aa4bb4e8c20615c16')}).then(function(result){
    console.log(result);
  })

  //db.close();
});
