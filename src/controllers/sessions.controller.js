import registerUserService from "../services/sessions.service.js"

function getSessionsStatus(req, res) {
  res.status(200).json({ message: 'Recurso sessions disponible' })
}

async function registerUser (req, res ) {
  try {
    const user = await registerUserService(req.body)
    res.status(201).json({
        status: 'success',
        payload: user
    })  
  } catch (error) {
  return res.status(error.statusCode || 500).json({
    status: "error",
    message: error.statusCode
      ? error.message
      : "Error interno del servidor"
  })
}

}

export {
  getSessionsStatus,
  registerUser
}

//validación, normalización de email, hash de contraseña con bcrypt y persistencia en MongoDB, respetando la arquitectura en capas.