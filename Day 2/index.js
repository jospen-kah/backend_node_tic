const express = require('express');
const app = express();
const members = require('./members')
const moment = require('moment')

const path = require('path')

const Port = process.env.PORT || 3000;

const logger = (req, res, next)=>{
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}:${moment().format()}`);
    next();
}

//init
app.use(logger);

app.use('/api/members', (req, res) =>{
    res.json(members);
});

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(Port, ()=>{
    console.log(`App listening  on port ${Port}`)
})