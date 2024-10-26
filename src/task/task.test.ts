import request from 'supertest'
import app from '../app'

describe('Task API', () => {
  beforeEach(async () => {
    await request(app).delete('/api/tasks/1')
  })

  it('GET /api/tasks - should return a list of tasks', async () => {
    const response = await request(app).get('/api/tasks')
    expect(response.status).toBe(200)
    expect(response.body.tasks).toBeDefined()
    expect(response.body.tasks.length).toBe(0)
  })

  it('POST /api/tasks - should add a new task', async () => {
    const newTask = { title: 'New Task', completed: false }
    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .set('Content-Type', 'application/json')

    expect(response.status).toBe(201)
    expect(response.body.task).toBeDefined()
    expect(response.body.task.title).toBe(newTask.title)
  })

  it('POST /api/tasks - should not add a task with missing title', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ completed: false })
      .set('Content-Type', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Title is required')
  })

  it('POST /api/tasks - should not add a task with empty title', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: '', completed: false })
      .set('Content-Type', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Title is required')
  })
  
  it('GET /api/tasks/:id - should return 404 for non-existent task', async () => {
    const response = await request(app).delete('/api/tasks/999')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Task not found')
  })

  it('POST /api/tasks - should not add a task with duplicate title', async () => {
    const newTask = { title: 'Duplicate Task', completed: false }
    
    await request(app)
      .post('/api/tasks')
      .send(newTask)
      .set('Content-Type', 'application/json')

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .set('Content-Type', 'application/json')

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Task with this title already exists')
  })

  it('DELETE /api/tasks/:id - should delete a task', async () => {
    const newTask = { title: 'Task to Delete', completed: false }

    const taskResponse = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .set('Content-Type', 'application/json')

    const taskId = taskResponse.body.task.id

    const response = await request(app).delete(`/api/tasks/${taskId}`)
    expect(response.status).toBe(204)

    const fetchResponse = await request(app).get('/api/tasks')
    expect(fetchResponse.body.tasks).not.toContainEqual(
      expect.objectContaining({ id: taskId })
    )
  })
})