// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/ToDoApp',{ useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to access MongoDB server')
  }
    console.log('Connect to MongoDB server')

    const db = client.db('ToDoApp')

    // db.collection('Todos').findOneAndUpdate({
    //   _id: new ObjectID('5c3fbb295e50c75895d6c265')
    // }, {
    //   $set: {
    //     completed: true
    //   }
    // }, {
    //     returnOriginal: false
    // }).then((results) => {
    //   console.log(results);
    // })

    db.collection('Users').findOneAndUpdate({
      _id: new ObjectID('5c423300d9d4617878f3f5b7')
    }, {
      $set: {
        name: 'Angel'
      },
      $inc: {
        age: 1
      }
    }, {
        returnOriginal: false
    }).then((results) => {
      console.log(results);
    })


    // client.close();
})
