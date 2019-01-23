const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {User} = require('./../models/User')
const {Todo} = require('./../models/Todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos)

describe('Post /todos', () => {
  it('should create a new todos', done => {
    let text = 'Text todo text'

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done()
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) =>{
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /Todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  })
})

describe('GET /Todos/:id', () => {
  it('should get one todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('should return 404 if todo is no found', (done) => {
    let hexId = new ObjectID().toString();
    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('should return 404 if ObjectId is invalid', (done) => {
    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  });

  it('should not get todo by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
});

describe('Delete /Todos:id', () => {
  it('find and remove one todo', (done) => {
    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect( res => {
        expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
      })
      .end((err, res) =>{
        if (err) {
          return done(err)
        }
        Todo.findById(todos[0]._id.toHexString())
        .then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e))
      });
  });

  it('should not todo if wrong user', (done) => {
    let hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) =>{
        if (err) {
          return done(err)
        }
        Todo.findById(hexId)
        .then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e))
      })
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

});

describe('PATCH /todos/:id', () =>{
  it('should update a todo', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'hello';


    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done)
  });

  it('should not update a todo if wrong user', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'hello';


    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done)
  })

  it('should clear completedAt when todo is not completed', (done) => {
    let hexId = todos[1]._id.toHexString();
    let text = 'hello!!!';


    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done)
  });
})

describe('GET /users/me', () =>{
  it('should return user if authenicated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenicated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    let email = '123@example.com';
    let password = 'password1'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBeTruthy();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch(e => done(e))
      });
  });

  it('should return validation errors if request invalid', (done) => {
    let email = 'jin1';
    let password = '111';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('should not creat user if email in use', (done) => {
    let email = 'jin111@example.com';
    let password =  'userOnePass';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });
});

describe('/POST /users/login', () => {
  it('should login user and reuth auth token', (done) => {
    let email = users[1].email;
    let password = users[1].password;

    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[1]._id).then(user => {
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          })
          done();
        }).catch(e => done(e))
      });
  });

  it('should reject invalid login', (done) => {
    let email = users[1].email;
    let password = '1234567';

    request(app)
    .post('/users/login')
    .send({email, password})
    .expect(400)
    .expect(res => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end(err => {
      if (err) {
          return done(err)
      }

      User.findById(users[1]._id).then(user => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch(e => done(e))
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should delete token when logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      User.findById(users[0]._id).then(user =>{
        expect(user.tokens.length).toBe(0)
        done();
      }).catch(e => done(e))
    })

  })
})
