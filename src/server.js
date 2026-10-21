import app from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'

app.listen(env.PORT, () => {

  connectDB()
  .then(() => console.log("conectado a DB"))
  .catch(e => console.log(e));
  console.log(`Servidor escuchando en el puerto ${env.PORT}`)
})
