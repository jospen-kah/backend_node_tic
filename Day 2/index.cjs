const express = require('express')

const app = express();


const exphbs = require('express-handlebars');
const router = require('./routes/api/courses.js');
const path = require('path');
const courses = require('./Courses');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

dotenv.config();

const authRoutes = require("./auth/auth.js");

// Add routes
app.use("/auth", authRoutes);


// const logger = require('./middleware/logger')

// // set static folder
app.use(express.static(path.join(__dirname, 'public')));


const Port = process.env.PORT || 3000;

const MONGOURL = process.env.MONGO_URI;

mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log('Connected to MongoDB!');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Use .engine to connect to frontend
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.get('/', (req, res) => res.render('index', {
    title: 'My Courses App',
    courses
}))

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/courses', router)


app.listen( Port, ()=>{
    console.log(`Connected on port ${Port}`)
})
