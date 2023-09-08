const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]



const url =
  `mongodb+srv://fullstack:${password}@cluster0.awwloiy.mongodb.net/phonebook?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
    id: Number,
    name:String,
    number: String
})
  
const Person = mongoose.model('Person',personSchema)

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

if(process.argv.length === 5){
    const name = String(process.argv[3])
    const number = String(process.argv[4])

    const id = Math.random() * 1000

    const person = new Person({
        id,
        name,
        number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })

}else if(process.argv.length === 3){
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(p =>{
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}