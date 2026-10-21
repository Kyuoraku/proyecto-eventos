import { userModel } from "../models/userModel.js";
import { hashPassword } from "../utils/hash.js"

async function registerUserService (userData) {
  const { first_name, last_name, email, password } = userData
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(typeof email !== "string" || !email.trim()){
    const error =  new Error("El formato del mail es incorrecto")
    error.statusCode = 400
    throw error
  }
  const normalizedEmail = email.trim().toLowerCase()

  if(!emailRegex.test(normalizedEmail)) {
    const error =  new Error("El formato del mail es incorrecto")
    error.statusCode = 400
    throw error
  }
  if(!first_name || !last_name){
    const error = new Error("Nombre o Apellido inválidos")
    error.statusCode = 400
    throw error
  }

  if(!email || !password) {
    const error = new Error("Mail o Contraseña inválidos")
    error.statusCode = 400
    throw error
  }

if (typeof password !== "string" || password.length < 6) {
    const error = new Error("La contraseña no puede tener menos de 6 caracteres")
    error.statusCode = 400
    throw error
  }

  const existingUser = await userModel.findOne({ email: normalizedEmail })

  if(existingUser) {
    const error = new Error("El email ya está registrado")
    error.statusCode = 409
    throw error
  }

  const hashedPassword = await hashPassword(password)
    const newUser = await userModel.create({
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword,
        role: "user"
    })

    const userResponse = newUser.toObject()
    delete userResponse.password

    return userResponse
}

export default registerUserService