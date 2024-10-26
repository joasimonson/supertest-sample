import { Router } from 'express'
import { getTasks, addTask, deleteTask } from './controller'

const router = Router()

router.get('/tasks', getTasks)
router.post('/tasks', addTask)
router.delete('/tasks/:id', deleteTask)

export default router