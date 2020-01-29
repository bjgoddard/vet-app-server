let bcrypt = require('bcryptjs')
let mongoose = require('mongoose')

// Creating Summary model
const summarySchema = new mongoose.Schema({
  rabiesShot: String,
  microchip: Number
})

// Creating Treatment model
const treatmentSchema = new mongoose.Schema({
  treatment: String,
  treatmentDate: Number
})

// Creating Pet model
const petSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  name: {
      type: String,
      required: true
  },
  typeOfAnimal: {
      type: String,
      required: true
  },
  breed: {
      type: String,
      required: true
  },
  age: Number,
  sex: String,
  petImage: String,
  summary: summarySchema,
  treatment: treatmentSchema,
  vet: {type: mongoose.Schema.Types.ObjectId, ref: 'Vet'}
})

let userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 1
  },
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 69
  },
  profileUrl: String,
  pets: [petSchema],
  summary: [{summarySchema}],
  treatment: [{treatmentSchema}]
})

// Create a helper function to compare the password hashes
userSchema.pre('save', function (next) {
  console.log('Pre save function. mod:', this.isModified(), "isNew:", this.isNew)
  console.log('length of password', this.password.length)
  if(this.isNew){
    console.log('It was new, HASH NOW')
    // New, as opposed to modified
    this.password = bcrypt.hashSync(this.password, 12)
  }
  console.log('Passed the if statement')
  next()
})
// Ensure that password doesn't get sent with the rest of the data
userSchema.set('toJSON', {
  transform: (doc, user) => {
    console.log(user)
    delete user.password
    delete user.__v
    return user
  }
})

// Create a helper function to compare the password hashes
userSchema.methods.isValidPassword = function (typedPassword) {
  return bcrypt.compareSync(typedPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
