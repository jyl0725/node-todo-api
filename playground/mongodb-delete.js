// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/ToDoApp',{ useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to access MongoDB server')
  }
    console.log('Connect to MongoDB server')

    const db = client.db('ToDoApp')

    db.collection('Users').deleteMany({name: 'Jin'})
    .then(result => {
      console.log(result)
    })
    .catch( err => {
      console.log(err)
    })

    db.collection('Users').findOneAndDelete({_id: new ObjectID("5c3fbd598c177e5927020229")})
    .then(result => {
      console.log(result)
    })
    .catch( err => {
      console.log(err)
    })


    // client.close();
})
