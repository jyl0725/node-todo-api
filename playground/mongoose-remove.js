const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result)
// })
//
//
// Todo.findOneAndRemove()

Todo.findByIdAndRemove('5c43c1d3d9d4617878f41600').then((doc) => console.log(doc))
