
import User from "../model/Userschema.js";
import bcryptjs from 'bcryptjs'
export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body; // Fixed typo

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" }); // Improved error message
    }
     const hashpassword = await bcryptjs.hash(password,10)
    // Create a new user
    const newUser = new User({
      fullname,
      email,
      password : hashpassword,  
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" ,user:{
      _id : newUser._id,
      fullname : newUser.fullname,
      email : newUser.email
    }});

  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async(req,res)=>{
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});
        const mathpassword = await bcryptjs.compare(password , user.password);
        if (!user || !mathpassword) {
            return res.status(400).json({message : "invalid username or password "})
        }else{
            res.status(200).json({message: "login successfully", 
                user : {
                    _id : user._id,
                    fullname : user.fullname,
                    email : user.email
                }})
        }
    } catch (error) {
        console.log("Error :"+error.message);
        return res.status(500).json({message : "internal server error "})
    }
}