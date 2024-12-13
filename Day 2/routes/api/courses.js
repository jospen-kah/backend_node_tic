const express = require('express');
// const auth = require("../../auth/middleware/auth")
const courses = require("./coursesSchema");
const mongoose = require("mongoose");
const router = express.Router();



// Get all courses
router.get('/', async (req, res) => {
    try {
        const courseData = await courses.find();
        // res.json({ message: "Welcome to the protected courses route!" });
        res.status(200).json(courseData)
    } catch (error) {
        console.error('Error retrieving courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
    try {
        const courseId = req.params.id
       

        const course = await courses.findById(courseId)
        
        if (!course) res.status(404).json({ message: `No course with the id of ${courseId}` });
        
        res.status(200).json(course);

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
        const newCourse = new courses({
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

         // Validate courseId as an ObjectId
         if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID format' });
        }

        const updatedCourse = await courses.findByIdAndUpdate(
            new mongoose.Types.ObjectId(courseId),
            updatedCourseData,
            { new: true }  // Return the updated document
        );
        
        if (updatedCourse) {
            return res.status(200).json({ message: 'Course updated successfully', updatedCourse });
        } else {
            return res.status(404).json({ message: `No course found with id ${courseId}` });
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
        
         // Validate courseId as an ObjectId
         if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID format' });
        }

        const deletedCourse = await courses.findByIdAndDelete(new mongoose.Types.ObjectId(courseId));
        
        if (deletedCourse) {
            res.status(200).json({ message: 'Course deleted successfully', deletedCourse });
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
