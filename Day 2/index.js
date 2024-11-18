const express = require('express');
const app = express();
const path = require('path')

const Port = process.env.PORT || 3000;

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(Port, ()=>{
    console.log(`App listening  on port ${Port}`)
})