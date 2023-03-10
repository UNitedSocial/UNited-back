const { default: mongoose } = require('mongoose')

mongoose.connect('mongodb+srv://root:root@cluster0.ob0zzyy.mongodb.net/example?retryWrites=true&w=majority', {}).then(() => {
  console.log('Connected to MongoDB')
}).catch((err) => {
  console.log('Error connecting to MongoDB', err)
})

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})
const Note = mongoose.model('Note', noteSchema)
const note = new Note({
  content: 'HTML is easy',
  date: new Date(),
  important: true
})
note.save().then((result) => {
  console.log(result)
  mongoose.connection.close()
}).catch((err) => {
  console.log('Error saving note', err)
})
