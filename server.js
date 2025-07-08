import express from "express"
import userRouter from "./routes/user.js"
import mongoose from "mongoose"
import taskRouter from "./routes/task.js"

const PORT = process.env.PORT || 5000

const app = express()

// Parse request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// User Route Middleware
app.use("/api/user", userRouter)

// Task Route Middleware
app.use("/api/tasks", taskRouter)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully")
    app.listen(PORT, () =>
      console.log(`Server runnuing at http://localhost:${PORT}/`)
    )
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err)
  })
