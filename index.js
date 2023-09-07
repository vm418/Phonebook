const { response, request } = require('express')
const express = require('express')
const app = express()

const morgan = require('morgan')
morgan.token('post-data', (req, res) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '';
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));


const cors = require('cors')

app.use(cors())




app.use(express.json())

let phonebook = [

    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response) => {
    response.json(phonebook)

})


app.get('/info',(request,response) =>{
    const length = phonebook.length
    const date = new Date()

    response.send(
        `<div><p>Phonebook has info for ${length} people</p><p>${date}</p></div>`
    )

})


app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    if (person){
        response.json(person)
    }else{
        response.status(404).end()
    }
    
})

app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    let person = request.body
    if (!person.name){
        response.status(400)
        response.json({ error: 'must be a name' })
    }else if(!person.number){
        response.status(400)
        response.json({ error: 'must be a number ' })
    }else if(phonebook.find(p => p.name === person.name)){
        response.status(400)
        response.json({ error: 'name must be unique' })
    }else{
        let id = Math.random() * 10000
        person.id = id
        phonebook = phonebook.concat(person)
        response.json(person)
    }    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
