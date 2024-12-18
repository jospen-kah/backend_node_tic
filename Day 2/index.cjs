const express = require('express')

const app = express();

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc")
const exphbs = require('express-handlebars');
const router = require('./routes/api/courses.js');
const path = require('path');
const courses = require('./Courses');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const file = require('./uploads/file')
const mails = require('./mails/mailer')

dotenv.config();
const authRoutes = require("./auth/auth.js");
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
// app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');
// app.get('/', (req, res) => res.render('index', {
//     title: 'My Courses App',
//     courses
// }))

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title:"Library API",
            version: "1.0.0",
            description: " A simple Express Library API"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
    },
        apis: ["./routes/*.js", "./auth/*.js"]


}
const specs = swaggerJsDoc(options)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// set static folder
// app.use(express.static(path.join(__dirname, 'public')));
// Add routes

app.use("/auth", authRoutes);

app.use('/api/courses', router)

app.use('/file', file)

app.use('/message', mails)


app.listen( Port, ()=>{
    console.log(`Connected on port ${Port}`)
})
