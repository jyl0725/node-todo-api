const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const todos =[{
  _id: new ObjectID(),
  text: 'First Test todo'
}, {
  _id: new ObjectID(),
  text: 'Second Test todo'
}];

beforeEach((done) =>{
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done())
})

describe('Post /todos', () => {
  it('should create a new todos', done => {
    let text = 'Text todo text'

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  })
})

describe('GET /Todos/:id', () => {
  it('should get one todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toString()}`)
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
      .expect(404)
      .end(done)
  });

  it('should return 404 if ObjectId is invalid', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done)
  });
});

describe('Delete /Todos:id', () => {
  it('should remove find and remove one todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toString()}`)
      .expect(200)
      .expect( res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .expect(todos.length).toBe(1)
      .end(done)
  });
});
