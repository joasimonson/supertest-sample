import { Request, Response } from 'express'

interface Task {
  id: number
  title: string
  completed: boolean
}

let tasks: Task[] = []

export const getTasks = (req: Request, res: Response) => {
  res.status(200).json({ tasks })
}

export const addTask = (req: Request, res: Response): any => {
  const { title, completed } = req.body

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required' })
  }

  if (tasks.find(task => task.title === title)) {
    return res.status(400).json({ message: 'Task with this title already exists' })
  }

  const newTask = { id: Date.now(), title, completed: completed || false }
  tasks.push(newTask)
  res.status(201).json({ task: newTask })
}

export const deleteTask = (req: Request, res: Response): any => {
  const taskId = parseInt(req.params.id)

  const taskIndex = tasks.findIndex(task => task.id === taskId)
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' })
  }

  tasks.splice(taskIndex, 1)
  res.status(204).send()
}
