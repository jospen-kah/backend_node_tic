 const User = require('../auth/usersSchema')
 const bcrypt = require("bcrypt");
 
 async function authRegisterController(req, res){
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
        const newUser = User.create({ username, email, password: hashedPassword });
        // await newUser.save();

        res.status(201).json({ message: "User registered successfully!"});
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" })
    }
}

module.exports = {authRegisterController}