import express from 'express'
import eventRouter from './routes/event.router.js'
import rootRouter from './routes/root.router.js'
import sessionsRouter from './routes/sessions.router.js'

const app = express()

app.use(express.json())

app.use('/api', rootRouter)
app.use('/api/events', eventRouter)
app.use('/api/sessions', sessionsRouter)

export default app
