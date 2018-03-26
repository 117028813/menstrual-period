const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.static('./www'))

app.get('/menstrual', (req, res) => {
  fs.readFile('./menstrual-date.json', 'utf-8', (err, data) => {
    res.send(data)
  })
})

app.listen(3000, () => {
  console.log('server run at port 3000')
})