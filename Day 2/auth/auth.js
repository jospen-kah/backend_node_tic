const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./usersSchema");

const authRouter = express.Router();
authRouter.use(express.json())

const key = process.env.KEY

/**
 * @swagger
 * components:
 *  schemas:
 *      Auth:
 *         type: object
 *         required:
 *              - username
 *              - email
 *              - password
 *         properties:
 *                username:
 *                  type: string
 *                  description: The users' name
 *                email:
 *                  type: string
 *                  description: The Users' email
 *                password:
 *                  type: string
 *                  description: The user's Password
 *         example:
 *                  username: Shanelle
 *                  email: shanelle@gmail.com
 *                  password: Password123
 */


/**
 * @swagger
 * components:
 *  schemas:
 *      Courses:
 *         type: object
 *         required:
 *              - course_name
 *              - course_code
 *         properties:
 *                course_name:
 *                  type: string
 *                  description: The courses' name
 *                course_code:
 *                  type: string
 *                  description: The course codes
 *         example:
 *                  course_name: Boolean Algebra
 *                  course_code: CEF211
 */

/**
 * @swagger
 * tags:
 *  name: Courses
 *  description: The Courses Management API
 */

/**
 * @swagger
 * /api/courses:
 *  get:
 *    summary: Returns the list of all the Courses
 *    tags: [Courses]
 *    responses: 
 *       200:
 *         description: The list of the Courses
 *         content: 
 *              application/json:
 *                  schema: 
 *                      type: array
 *                      items: 
 *                         $ref: '#/components/schemas/Courses'
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get the course by Id
 *     tags: [Courses]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The Course Id
 *     responses: 
 *        200:
 *          description: The course description by Id
 *          contents:  
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Courses'
 *        404:
 *          description: The course was not found
 */
 
/**
 * @swagger
 * /api/courses/:
 *  post:
 *   summary: Create a new Course
 *   tags: [Courses]
 *   requestBody:
 *     required: true
 *     content: 
 *       application/json:
 *          schema:
 *             $ref: '#/components/schemas/Courses'
 *   responses:
 *     200:
 *       description: The course was successfully created
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Courses'
 *     500:
 *       description: Some Server error
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update the course by Id
 *     tags: [Courses]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The Course Id
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *            schema:
 *             $ref: '#/components/schemas/Courses'
 *     responses: 
 *        200:
 *          description: Update course description by Id
 *          contents:  
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Courses'
 *        404:
 *          description: The course was not found
 *        500:
 *          description: An internal server error occured
 */

/**
 * @swagger
 *  /api/courses/{id}:
 *   delete:
 *     summary: Delete the course by Id
 *     tags: [Courses]
 *     parameters:
 *         - in: path
 *           name: id
 *           schema: 
 *              type: string
 *           required: true
 *           description: The Course Id
 *     responses:
 *        200:
 *          description: The Course is deleted by Id
 *          content: 
 *            application/json
 *          schema:
 *              $ref: '#/components/schema/Courses'
 *        404:
 *          description: The course was not found
 *        500:
 *          description: An internal server occoured
 *              
 */

  
authRouter.post("/register", async (req, res) =>{
    const data = req.body
    try {
        // console.log("data here", data)

        const { username, email, password } = await req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exist" })

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create the user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", data: JSON.stringify(newUser) });
    }
    catch (err) {
        res.status(500).json({ mssage: "Something went wrong", error: err.message })
    }
})


authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        //compare Passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            key,
            { expiresIn: "1h" }

        );
        console.log(key, token)

        res.status(200).json({
            message: "Login Successful",
            token,
        });

    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message })
    }
})

module.exports = authRouter