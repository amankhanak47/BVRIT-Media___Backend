const connectToMongo=require("./database")
const express = require('express')

var cors = require('cors')



connectToMongo();

const app = express();
app.use(cors());
const port = process.env.PORT||5000
app.get('/', (req, res) => {
  res.send('media')
})

app.use(express.json())


app.use('/auth', require('./routes/auth.js'))





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})