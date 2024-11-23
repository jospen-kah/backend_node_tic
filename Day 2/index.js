const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const router = require('./routes/api/courses');
const path = require('path');
const courses = require('./Courses')
// const logger = require('./middleware/logger')

// // set static folder
// app.use(express.static(path.join(__dirname, 'public')));


const Port = process.env.PORT || 3000;

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

app.listen(Port, () => {
    console.log(`App listening  on port ${Port}`)
})