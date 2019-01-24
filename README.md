#TODO API

A backend API built on Node.js with Express.js web framework and a MongoDB database.
The application is currently live at
[Todo backend API](https://kabanboard-node-api.herokuapp.com/ "Google's Homepage")

#Usage

To create/login an user and allow user to create a list of Todos.


#HOW TO Use

Currently the App can be used with Postman (will be integrated with a React Front-End shortly)
1. Create a new user:
send a post request to `https://kabanboard-node-api.herokuapp.com/users`

![Post User](https://github.com/jyl0725/todo-api/asset/post:user.png")

You will receive a JWT in the response header
![Post User](https://github.com/jyl0725/todo-api/asset/x-auth.png")

2. Check if for current User:
send a get request to `https://kabanboard-node-api.herokuapp.com/users`
with JWT in request header to verify the current user
![Check User](https://github.com/jyl0725/todo-api/asset/check-user.png")

3. Login Existing User:
send a post request to `https://kabanboard-node-api.herokuapp.com/users/login`
with exiting email/password (password is hashed with salt through JWT/BCRYPT BEFORE SAVING TO MONGOD DB DATABASE)
password is then verify with JWT to match the password digest saved in the database

![Login User](https://github.com/jyl0725/todo-api/asset/check-user.png")

4. Logging Out User:
send a delete request to `https://kabanboard-node-api.herokuapp.com/users/me/token`
This will remove the JWT token store in the user's object in MongoDB database
![LogOut User](https://github.com/jyl0725/todo-api/asset/logout-user.png")

5. Post task:
send a post request to `https://kabanboard-node-api.herokuapp.com/todos` with following information:
with JWT in header

![Post Todos](https://github.com/jyl0725/todo-api/asset/post-tods.png")
![Post Todos Response](https://github.com/jyl0725/todo-api/asset/post-tods-response.png")

6. Get tasks:
To retrieve all  tasks send a get request to `https://kabanboard-node-api.herokuapp.com/todos` with JWT("x-auth") in header
To retrieve 1 task send a get request to `https://kabanboard-node-api.herokuapp.com/todos/:id` with JWT("x-auth") in header

7. Update task:
To update a task to be completed/ or change task send a patch request to `https://kabanboard-node-api.herokuapp.com/todos/:id` with JWT("x-auth") in header
![Patch Todos](https://github.com/jyl0725/todo-api/asset/patch-tods.png")

8. Delete task:
To delete a task send a delete request to `https://kabanboard-node-api.herokuapp.com/todos/:id` with JWT("x-auth") in header.

#Future Development
This application will be integrated with a React-Frontend.

The Todo Model will be updated with a categories of (Pre-Task, Current, and Completed).

The Todo Model will be updated with a selection type (High-Priority, Regular, Low-Priority )

A User will be able to update their password.

A User can add a friend to share his/her Todos. 
