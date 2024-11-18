const express = require('express');
const app = express();
const router = require('./routes/api/members')

// const logger = require('./middleware/logger')


const path = require('path')

const Port = process.env.PORT || 3000;



//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/members', router)

app.listen(Port, () => {
    console.log(`App listening  on port ${Port}`)
})