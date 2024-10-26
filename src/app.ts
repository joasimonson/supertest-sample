import express, { Application } from 'express'
import taskRoutes from './task/tasks.routes'

const app: Application = express()

app.use(express.json())
app.use('/api', taskRoutes)

export default app