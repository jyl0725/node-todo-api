// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');



MongoClient.connect('mongodb://localhost:27017/ToDoApp',{ useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to access MongoDB server')
  }
    console.log('Connect to MongoDB server')

    const db = client.db('ToDoApp')

  // db.collection('Todos').find({
  //   _id: new ObjectID('5c4224653e198dad7e2f3913')
  // }).toArray().then((docs) => {
  //   console.log('Users');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Uanble to fetch todos', errs)
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  // }, err => {
  //     console.log('Uanble to fetch todos', errs)
  // })

  db.collection('Users').find({name: 'Jin'}).toArray()
  .then((users) => {
    console.log(JSON.stringify(users, undefined, 2))
  })
  .catch((err) => {
    console.log('Unable to fetch todos', err)
  })

    // client.close();
});
