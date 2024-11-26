import express from 'express';
const uuid = require('uuid')

const courses = require('../../Courses')

const router = express.Router();

router.get('/', (req, res) => {
    res.json(courses);
});


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