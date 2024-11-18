const express = require('express');
const app = express();

const Port = 3000;

app.get('/', (req, res) =>{
     const htmlContent = '<html><body><h1>Hello World</h1></body></html>'

     res.send(htmlContent)
})

app.listen(Port, ()=>{
    console.log(`App listent on port ${Port}`)
})