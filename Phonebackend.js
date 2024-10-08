const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = 

[
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/info',(request,response) => {
    response.send(`<p>Phonebook has info for ${persons.length}
    people <p>${Date()}</p></p>`)
})

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    }
    else {
        response.status(204).end()
    }
})


const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(person => Number(person.id)))
  : 0
  return String(maxId + 1)
}

app.post('/api/persons',(request,response) => {
  const person = request.body
  const nameExists = persons.some(p => p.name === person.name)
  if(!person.name || !person.number) {
    return response.status(400).json({
      error: 'missing content' 
    })
  }
  if(nameExists) {
    return response.status(409).json({
      error: `${person.name} has already been added`
    })
  }
  else {
    const newPerson = {
      id: generateId(),
      name: person.name,
      number: person.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
  }
})

app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(404).end() 
  
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)