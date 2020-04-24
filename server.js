const express = require('express')
const {User} = require('./models')
const jwt = require('jsonwebtoken')

const SECRET = 'thisisatestsecret'

const app = express()
//allow express to handle json format
app.use(express.json())

app.get('/api/users', async (req, res)=>{
  const users = await User.find()
  res.send(users)
})

app.post('/api/signup', async (req, res)=>{
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send(user)
})

app.post('/api/signin', async (req, res)=>{
  const user = await User.findOne({
    username: req.body.username
  })
  if(!user){
    res.status(422).send('username not exists')
  }
  const isPwdValid = require('bcrypt').compareSync(req.body.password, user.password)
  if(!isPwdValid){
    res.status(422).send('password incorrect')
  }

  const token = jwt.sign({
    id: user._id
  }, SECRET)

  res.send({
    user,
    token
  })
})

// auth中间件就是一个函数
const auth = async (req, res, next) => {
  const raw = String(req.headers.authorization).split(' ').pop()
  const {id} = jwt.verify(raw, SECRET)
  req.user = await User.findById(id)
  next()
}

app.get('/api/profile', auth, async (req, res)=>{
  res.send(req.user)
})

app.listen(3001, (req, res)=>{
  console.log('http://localhost:3001')
})