const express = require('express')
const uuid = require('uuid')
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const courses = require('../../Courses')

const router = express.Router();





//retreive data from mongodb
const courseSchema = new mongoose.Schema({
    id: Number,
    course_name: String,
    course_code: String,
})

//create model
const courseModel = mongoose.model("courses", courseSchema)

//get courses
try{
router.get('/', async(req, res) => {
    const courseData = await courseModel.find()
    res.json(courseData);
});
}
catch(error){
    console.error('Error retrieving courses:', error);
    res.status(500).json({ message: 'Internal server error' });
}


// Get Single Member
router.get('/:id', (req, res) => {
    const found = courses.some(course => course.id === parseInt(req.params.id));
    if (found) {
        res.json(courses.filter(course => course.id === parseInt(req.params.id)))
    }

    else {
        res.status(400).json({ message: `No course with the id of ${req.params.id}` })
    }

})


//Post Courses
router.post('/', (req, res) => {
    const { course_name, course_code } = req.body
    if (!course_name || !course_code) {
        res.status(400).json({ message: 'Fields required ' })
    }
    const newCourse = {
        id: uuid.v4(),
        course_name,
        course_code
    }

    // courses.push(newCourse)
    //    res.json(courses)
    res.redirect('/')
})

//Update Course
router.put('/:id', (req, res) => {
    const found = courses.some(course => course.id === parseInt(req.params.id));
    if (found) {
        const upDCourse = req.body;
        courses.forEach(course => {
            if (course.id === parseInt(req.params.id)) {
                course.course_name = upDCourse.course_name ? upDCourse.course_name : course.course_name;
                course.course_code = upDCourse.course_code ? upDCourse.course_code : course.course_code;

                res.json({ msg: " Course Updated", course })
            };
        });
    }

    else {
        res.status(400).json({ message: `No course with the id of ${req.params.id}` })
    }

})
//Delete Course
router.delete('/:id', (req, res) => {
    const found = courses.some(course => course.id === parseInt(req.params.id))

    if (found) {
        res.json({ msg: 'Course Deleted', courses: courses.filter(course => course.id !== parseInt(req.params.id)) })
    }
    else {
        res.status(400).json({ message: `No course with the id of ${req.params.id}` })
    }

})

module.exports = router;