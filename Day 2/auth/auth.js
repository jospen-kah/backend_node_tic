const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./usersSchema");

const authRouter = express.Router();
authRouter.use(express.json())

authRouter.post("/register", async(req, res) =>
{
    const data = req.body
    try{


        // console.log("data here", data)
        
        const { username, email, password} = await req.body;
        

        const existingUser = await User.findOne({ email });
        if(existingUser) return res.status(400).json({ message: "User already exist"})
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create the user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!",data:JSON.stringify(newUser) });
    } 
    catch (err){ 
        res.status(500).json({ mssage: "Something went wrong",  error: err.message})
    }
})


authRouter.post("/login", async(req, res) => {
    try{ 
        const { email, password} = req.body;

        //find user
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({ message: "User not found"});

        //compare Passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: "Invalid credentials"});

        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );
        
        res.status(200).json({message: "Login Successful"});

    }
    catch(err){
        res.status(500).json({ message: "Something went wrong", error: err.message})
    }
})

module.exports = authRouter