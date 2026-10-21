import { Router } from 'express'
import { getSessionsStatus, registerUser } from '../controllers/sessions.controller.js'

const router = Router()

router.get('/', getSessionsStatus)
router.post('/register', registerUser)
export default router
