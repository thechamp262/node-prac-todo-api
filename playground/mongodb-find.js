// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',function(err,db){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Users').find({name: 'Anthony'}).toArray().then(function(docs){
    console.log('Here are your list of users: ');
    console.log(JSON.stringify(docs,undefined,2));
  },function(err){
    console.log("Unable to grab user data", err);
  })
  // db.collection('Todos').find().count().then(function(count){
  //   console.log('Todos');
  //   console.log(`Todos count: ${count}`);
  //   //console.log(JSON.stringify(docs,undefined,2));
  //
  // }, function(err){
  //   console.log('Unable to fetch todos',err)
  // });
  //db.close();
});
