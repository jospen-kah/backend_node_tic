const express = require('express');
const app = express()

const Port = 3000;

app.get('/', (req, res) =>{
    res.status(200).send("Hello world");
})

app.listen(3000, () => {
    console.log(`Listening on port ${Port}`);
});