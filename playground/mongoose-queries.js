const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

let id = '5c427cbbafadf023153b43e7';

// if (!ObjectID.isValid(id)) {
//   console.log('ID not valid')
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos', todo)
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found')
//   }
//   console.log('Todos', todo)
// }).catch(e => console.log(e))

User.findById(id)
  .then(res => {
    if (!res) {
      console.log('Id not found')
    }

    console.log(JSON.stringify(res, undefined, 2))
  }).catch(e => console.log(e))
