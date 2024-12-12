const mongoose = require("mongoose");

//Define the courses schema and model
const courseSchema = new mongoose.Schema({
    course_name: { type: String},
    course_code: { type: String}
});


module.exports = mongoose.model("Courses",courseSchema)