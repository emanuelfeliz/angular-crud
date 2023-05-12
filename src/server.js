const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { validationResult } = require('fluent-validation');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema and model for your data
const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean
});

const Todo = mongoose.model('Todo', TodoSchema);

// Define validation rules using FluentValidation syntax
const createTodoValidator = validationResult({
  title: ['required', 'string', 'max:50'],
  description: ['string', 'max:255'],
  completed: ['boolean']
});

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// API endpoint for creating a new todo
app.post('/api/todos', (req, res) => {
  const { title, description, completed } = req.body;

  // Validate the request body
  const errors = createTodoValidator.validate(req.body);
  if (errors) {
    return res.status(400).json({ errors });
  }

  // Create a new todo
  const newTodo = new Todo({
    title,
    description,
    completed
  });

  // Save the todo to the database
  newTodo.save()
    .then(todo => res.status(201).json(todo))
    .catch(err => res.status(500).json({ error: err.message }));
});

// ... Implement other CRUD endpoints (GET, PUT, DELETE) similarly

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
