import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) return res.status(401).json({ error: "Access Denied" })

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid Token" })
  }
}

export default authMiddleware
