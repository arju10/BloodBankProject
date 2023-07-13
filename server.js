const express = require('express')

// rest object
const app = express()

// port
const PORT = 5000

// test routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// listen
app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})