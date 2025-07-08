import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if a field is missing
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Someone is already using this email" })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new User
    const newUser = new User({ name, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ message: `Signed up ${name}` })
  } catch (error) {
    console.log("Sign up error:", error)
    res.status(500).json({ error: "Server Error" })
  }
}

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Both Email and Password are required" })
    }

    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid email or password." })
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET
    )

    res.status(200).json({ message: "You are logged in.", accessToken })
  } catch (error) {
    console.log("Login error:", error)
    res.status(500).json({ error: "Server Error" })
  }
}

export { signupController, loginController }
