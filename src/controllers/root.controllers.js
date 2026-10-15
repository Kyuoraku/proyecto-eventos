export function healthStatus(req, res) {
  res.status(200).json({ status: 'Servidor funcionando' })
}
