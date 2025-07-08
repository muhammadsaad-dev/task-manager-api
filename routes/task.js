import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import {
  getTasks,
  getOneTask,
  addTask,
  deleteTask,
  updateTask,
} from "../controllers/taskController.js"

const taskRouter = Router()

taskRouter.get("/", authMiddleware, getTasks)

taskRouter.get("/:id", authMiddleware, getOneTask)

taskRouter.post("/", authMiddleware, addTask)

taskRouter.put("/:id", authMiddleware, updateTask)

taskRouter.delete("/:id", authMiddleware, deleteTask)

export default taskRouter
