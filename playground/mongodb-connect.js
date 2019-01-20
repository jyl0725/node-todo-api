// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/ToDoApp',{ useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to access MongoDB server')
  }
    console.log('Connect to MongoDB server')

    const db = client.db('ToDoApp')

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, results) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }
  //   console.log(JSON.stringify(results.ops))
  // });

    db.collection('Users').insertOne({
      name: 'Jin',
      age: 27,
      location: 'NY'
    }, (err, results) => {
        if (err) {
          return console.log('Unable to insert user', err)
        }
        console.log(JSON.stringify(results.ops[0]))
    })

    client.close();
})
