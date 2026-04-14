/**
 * JWT authentication middleware for API routes.
 *
 * @author Jakob Norrgård
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'

/**
 * Verifies the JWT token from the Authorization header.
 * Attaches the decoded user payload to req.apiUser on success.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
export const requireApiAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Åtkomst nekad. Token saknas.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.apiUser = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Ogiltig eller utgången token.' })
  }
}
