require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/Todo');
let {User} = require('./models/User');
let {authenticate} = require('./middleware/authenticate');

let app = express();

const port = process.env.PORT || 3000

app.use(bodyParser.json());

// authenticate user to post to user's todo list
app.post('/todos',authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then((doc) => {
    res.send(doc);
  }).catch(err => {
    res.status(400).send(err)
  })
})
// only retreieve todo for a user
app.get('/todos',authenticate, (req, res) => {
  // Todo.find().then((todos) => {
  //   res.send({todos})
  Todo.find({_creator: req.user._id}).then(todos => {
    res.send({todos})
  }).catch(err => res.status(400).send(err))
})

app.get('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      res.status(404).send()
    }
    res.send({todo})
  }).catch((err) => {
    res.status(400).send()
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
  .then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    return res.send({todo})
  }).catch( err => res.status(400).send(err))
})

app.patch('/todos/:id', authenticate, (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
    {
      $set: body
    },
    {
      new: true
    })
  .then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo})
  }).catch(e => res.status(400).send())
})

app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  let user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) =>{
    res.header('x-auth', token).send(user);
  }).catch((err) => res.status(400).send(err));
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
})

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => res.status(400).send());
})

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
})

app.listen(port, () => {
  console.log(`started up at port ${port}`)
})

module.exports = {app}
