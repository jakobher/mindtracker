/**
 * @file authentication middleware.
 * @module middleware/auth
 * @author Jakob Hermansson
 */

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const directoryFullName = dirname(fileURLToPath(import.meta.url))

/**
 * Authentication middleware.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res
      .status(404)
      .sendFile(join(directoryFullName, '..', 'views', 'errors', '404.html'))
  }
}

/**
 * Authorization middleware to check if the user is the owner of the document.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const isOwner = async (req, res, next) => {
  try {
    // req.doc comes from loadSnippetDocument middleware.
    if (req.doc.user.toString() === req.session.user.id) {
      next()
    } else {
      res
        .status(403)
        .sendFile(join(directoryFullName, '..', 'views', 'errors', '403.html'))
    }
  } catch (error) {
    next(error)
  }
}