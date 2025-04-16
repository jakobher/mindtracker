/**
 * @file Error handling middleware.
 * @module middleware/error
 * @author Jakob Hermansson
 */

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const directoryFullName = dirname(fileURLToPath(import.meta.url))

/**
 * Error handling middleware.
 *
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err)

  // Handle 404 Not Found
  if (err.status === 404) {
    res
      .status(404)
      .sendFile(join(directoryFullName, '..', 'views', 'errors', '404.html'))
    return
  }

  // Production error handling
  if (process.env.NODE_ENV === 'production') {
    res
      .status(500)
      .sendFile(join(directoryFullName, '..', 'views', 'errors', '500.html'))
    return
  }

  // Development error handling
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
}
