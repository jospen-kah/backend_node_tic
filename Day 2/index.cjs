const express = require('express');

  const dotenv =  require("dotenv");
const mongoose =  require("mongoose");

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
const MONGOURL = process.env.MONGO_URI;

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB!');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });


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

