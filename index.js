const { response, request } = require('express')
const express = require('express')
const app = express()
const path = require('path'); // Import the path module

const Person = require('./models/person')


const morgan = require('morgan')
morgan.token('post-data', (req, res) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '';
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));


const cors = require('cors');
const { default: mongoose } = require('mongoose');

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

app.get('/api/persons',(request,response) => {
    Person.find({}).then(p => {
      response.json(p)
    })

})

app.get('/info',(request,response) =>{
    
    const date = new Date()
    
    Person.countDocuments({}).then(length => {
      response.send(
        `<div><p>Phonebook has info for ${length} people</p><p>${date}</p></div>`
    )
    })
})

app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    Person.find({id}).then(p => {
      response.json(p)
    })  
})

app.delete('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    let newperson = request.body
    if (!newperson.name){
        response.status(400)
        response.json({ error: 'must be a name' })
    }else if(!newperson.number){
        response.status(400)
        response.json({ error: 'must be a number ' })
    // }else if(phonebook.find(p => p.name === person.name)){
    //     response.status(400)
    //     response.json({ error: 'name must be unique' })
    }else{
        let id = Math.random() * 10000
        
        const person = new Person({
          id,
          ...newperson
        })
        person.save().then(result =>{
          console.log(`added ${person}`)
          mongoose.connection.close()
          response.status(201).json(result)
        })
    }    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
