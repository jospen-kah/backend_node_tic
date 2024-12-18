const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./usersSchema");
const { authRegisterController } = require("../controllers/auth");

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
 * tags: 
 *   name: Users
 *   description: The User Management API
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
 *          contentj:  
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Courses'
 *        404:
 *          description: The course was not found
 *        500:
 *          description: An internal server error occurred
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete the course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the course to delete
 *     responses:
 *       200:
 *         description: The course was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Courses'
 *       404:
 *         description: The course was not found
 *       500:
 *         description: An internal server error occurred
 */





 /**
  * @swagger
  * /auth/register/:
  *  post:
  *     summary: Create a new User
  *     tags: [Users]
  *     requestBody:
  *         required: true
  *         content:
  *            application/json:
  *               schema:
  *                 $ref: '#/components/schemas/Auth'
  *     responses: 
  *        200:
  *          description: The User successfully logged in with the id
  *          content: 
  *            application/json:
  *                 schema:
  *                    $ref: '#/components/schemas/Auth'
  *        400:
  *          description: The User inputted the wrong credentials
  *        404:
  *          description: The user with the credential was not found
  *        500:
  *          description: The was an internal server error that occurred
  */ 
authRouter.post("/register", authRegisterController)

/**
 * @swagger
 * /auth/login/:
 *   post:
 *    summary: Login a User
 *    tags: [Users]
 *    requestBody:
 *        required: true
 *        content: 
 *           application/json: 
 *              schema:
 *                $ref: '#/components/schemas/Auth'
 *    responses: 
 *        200:
 *          description: The existing user successfully accessed back his/her account
 *          content: 
 *             application/json:
 *                 schema:
 *                    $ref: '#/components/schemas/Auth'
 *        400:
 *          description: The User credentials do not match
 *        404:
 *          description: The User trying to login was not found
 *        500:
 *          description: The was an internal server error
 */
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