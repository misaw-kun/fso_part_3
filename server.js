const express = require('express');
const app = express();

app.use(express.json());

const PORT = 3001;

// data
let contacts = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

// routes
app.get('/api/persons', (req, res) => {
  res.json(contacts);
});

app.get('/api/info', (req, res) => {
  const count = notes.length;
  res.send(`<div>
    <p>phonebook has info for ${count} people</p>
    <p>${Date()}</p>
  </div>`);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = contacts.find((contact) => contact.id === id);

  if (!person) {
    res.status(404).end();
  } else {
    res.json(person);
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  let contact = req.body;
  // console.log(contact);

  if (!contact.name || !contact.number) {
    return res.status(400).json({
      error: 'name or number is missing!',
    });
  }

  if (contacts.find((person) => person.name === contact.name)) {
    return res.status(403).json({
      error: 'person already exists in phonebook!',
    });
  }

  contact.id = Math.floor(Math.random() * 5000);
  contacts.concat(contact);

  res.json(contact);
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
