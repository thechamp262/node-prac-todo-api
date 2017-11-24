// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',function(err,db){
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  //findOneAndUpdate

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5a15e5b5e6f6db3bd4adeee9')
  // },{
  //   $set:{
  //     completed: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then(function(result){
  //   console.log(result);
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a15c94d6bffa05ff88b225b')
  },{
    $set:{
      name: 'Anthony'
    },
    $inc:{
      age: -10
    }
  },{
    returnOriginal: false
  }).then(function(result){
    console.log(result);
  })
  //db.close();
});
