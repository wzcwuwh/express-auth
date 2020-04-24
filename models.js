const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017/express-auth'

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const UserSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String, 
    set(val) {
      return require('bcrypt').hashSync(val, 10)
    }
  }
})
const User = mongoose.model('User', UserSchema)

module.exports = {User}