import express from 'express';

import dotenv from "dotenv"
import mongoose from "mongoose";




const app = express();
dotenv.config();

const exphbs = require('express-handlebars');
const router = require('./routes/api/courses');
const path = require('path');
const courses = require('./Courses')


// const logger = require('./middleware/logger')

// // set static folder
// app.use(express.static(path.join(__dirname, 'public')));


const Port = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

mongoose
.connect(MONGOURL)
.then( () => {
    console.log("Database connected Successfully");
    app.listen(Port, () => {
        console.log(`App listening  on port ${Port}`)
    })
})

// Use .engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' })); 
app.set('view engine', 'handlebars');
app.get('/' , (req, res) => res.render('index', {
    title: 'My Courses App',
    courses
}))

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/courses', router)

