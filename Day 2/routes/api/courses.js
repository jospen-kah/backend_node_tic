const express = require('express');
const auth = require("../../auth/middleware/auth")
const mongoose = require("mongoose");

const router = express.Router();


// Define course schema and model
const courseSchema = new mongoose.Schema({
    course_name: { type: String},
    course_code: { type: String}
});



// Create course model
const courseModel = mongoose.model("courses", courseSchema);









// Get all courses
router.get('/', async (req, res) => {
    try {
        const courseData = await courseModel.find();
        res.json({ message: "Welcome to the protected courses route!" });
        res.json(courseData);
    } catch (error) {
        console.error('Error retrieving courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
    try {
        const courseId = req.params.id
        // const foundCourse = await courseModel.findOne({ _id: courseId });

        const course = await courseModel.findById(courseId)
        
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: `No course with the id of ${courseId}` });
        }
    } catch (error) {
        console.error('Error retrieving course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Post a new course
router.post('/', async (req, res) => {
    const { course_name, course_code  } = req.body;
    
    if (!course_name || !course_code ) {
        return res.status(400).json({ message: ' course_name, course_code, and are required.' });
    }
    
    try {
        // Create a new course document and save it
        const newCourse = new courseModel({
            course_name,
            course_code,
           
        });

        await newCourse.save();  // Save to the MongoDB
        res.status(201).json(newCourse);  // Respond with the newly created course
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update an existing course
router.put('/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const updatedCourseData = req.body;
        
        const updatedCourse = await courseModel.findOneAndUpdate(
            { course_id: courseId },
            updatedCourseData,
            { new: true }  // Return the updated document
        );
        
        if (updatedCourse) {
            res.json({ message: 'Course updated successfully', updatedCourse });
        } else {
            res.status(404).json({ message: `No course found with id ${courseId}` });
        }
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a course
router.delete('/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        
        const deletedCourse = await courseModel.findOneAndDelete({ course_id: courseId });
        
        if (deletedCourse) {
            res.json({ message: 'Course deleted successfully', deletedCourse });
        } else {
            res.status(404).json({ message: `No course found with id ${courseId}` });
        }
    } 
    catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
