const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('data', function (req, res) { 
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  {
    id: "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    id: "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    id: "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    id: "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const dateInfo = Date(Date.now())
  response.send(`<p>Phonebook has info for ${persons.length} people</p> ${dateInfo}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const randomId = Math.floor(Math.random() * (1000000000 - 1) + 1)
  const body = request.body
  const names = persons.map(person => person.name)

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (names.includes(body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: randomId
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})