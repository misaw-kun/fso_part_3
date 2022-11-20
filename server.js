require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contacts')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('post-res', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :response-time :post-res'))

const PORT = process.env.PORT

// routes
app.get('/api/persons', (req, res, next) => {
  Contact.find({})
    .then((results) => {
      if (results) {
        res.json(results)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

app.get('/api/info', (req, res, next) => {
  Contact.countDocuments({}, (err, count) => {
    res.send(`<div>
    <p>phonebook has info for ${count} people</p>
    <p>accessed at ${Date()}</p>
  </div>`)
  }).catch((err) => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then((person) => {
      res.status(200).json(person)
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((result) => {
      // console.log(result);
      if (result) {
        res
          .status(202)
          .json({ msg: `${result.name} removed from the phonebook` })
      } else {
        res.status(404).json({ msg: 'contact not found' })
      }
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
  let contact = req.body

  // if (!contact.name || !contact.number) {
  //   res.status(400).json({
  //     error: 'name or number is missing!',
  //   });
  // }

  const person = new Contact({
    name: contact.name,
    number: contact.number,
  })

  person
    .save()
    .then((savedContact) => res.status(201).json(savedContact))
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req
  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedContact) => {
      res.status(200).json(updatedContact)
    })
    .catch((err) => next(err))
})

// error handling

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message })
  }
  next(err)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
