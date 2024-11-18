const express = require('express');
const app = express();
const path = require('path')

const Port = process.env.PORT || 3000;

app.get('/', (req, res) =>{
res.sendFile(path.join(__dirname, 'public', 'index.html'));
   
})

app.listen(Port, ()=>{
    console.log(`App listening  on port ${Port}`)
})