import Task from "../models/Task.js"

// @desc Gets all the task
// @route GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId })
    res.status(200).json(tasks)
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// @desc Gets one task
// @route GET /api/tasks/:id
const getOneTask = async (req, res) => {
  try {
    const id = req.params.id
    const task = await Task.findById(id)
    if (!task) {
      return res.status(404).json(`Task with the id of ${id} was not found`)
    }
    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Access denied" })
    }
    res.status(200).json(task)
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// @desc Adds a new task
// @route POST /api/tasks/add
const addTask = async (req, res) => {
  try {
    const { title, completed } = req.body
    if (!title) {
      return res.status(400).json({ error: "Title is required" })
    }

    const newTask = new Task({
      title,
      completed: completed || false,
      user: req.userId,
    })
    await newTask.save()

    res.status(201).json({ message: "Task added succesfully", task: newTask })
  } catch (error) {
    console.error("Failed to add task:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// @desc Updates a task
// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body

    if (!title && !completed) {
      return
    }

    const id = req.params.id
    const task = await Task.findById(id)

    if (!task) {
      return res
        .status(404)
        .json({ error: `Task with the id of ${id} was not found` })
    }

    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Access denied" })
    }

    if (title !== undefined) task.title = title
    if (completed !== undefined) task.completed = completed

    await task.save()
    res.status(200).json({ message: "Task updated succesfully", task: task })
  } catch (error) {
    console.error("Failed to update task:", error)
    res.status(500).json({ error: "Server error" })
  }
}

// @desc Deletes a task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({ error: "Task Id is required" })
    }
    const task = await Task.findById(id)
    if (!task) {
      return res
        .status(404)
        .json({ error: `Task with the id of ${id} was not found` })
    }
    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ error: "Access denied" })
    }
    await task.deleteOne()
    res.status(200).json({ message: "Task deleted succesfully", task: task })
  } catch (error) {
    console.error("Failed to delete task:", error)
    res.status(500).json({ error: "Server error" })
  }
}

export { getTasks, getOneTask, addTask, deleteTask, updateTask }
