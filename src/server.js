/**
 * @file Main application entry point
 * @module server
 * @author Jakob Hermansson
 */
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import csurf from 'csurf'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectToDatabase } from './config/mongoose.js'
import { sessionOptions } from './config/sessionOptions.js'
import { router } from './routes/router.js'
import { errorHandler } from './middleware/errorHandler.js'

try {
  // Connect to MongoDB
  await connectToDatabase(process.env.DB_CONNECTION_STRING)

  // Create an Express application
  const app = express()

  // Get the directory name of this module's path
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Set base URL for the application (defaults to '/' if not specified in env)
  const baseURL = process.env.BASE_URL || '/'

  // Configure view engine settings
  app.set('view engine', 'ejs') // Use EJS as the template engine
  app.set('views', join(directoryFullName, 'views')) // Set path for views
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'main')) // Set default layout
  app.use(expressLayouts) // Enable layout support

  // Parse requests of the content type application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false }))

  // Serve static files from the public directory
  app.use(express.static(join(directoryFullName, 'public')))

  // Configure session handling for production environment
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // Trust the first proxy for secure cookies
  }

  // Setup and use the session middleware
  app.use(session(sessionOptions))

  // Setup and use the CSRF protection middleware
  app.use(csurf())

  // Make the CSRF token available to all views
  app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
  })

  // Custom middleware for flash messages and base URL
  app.use((req, res, next) => {
    // Handle flash messages - persist only for one request
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Make base URL available to all views
    res.locals.baseURL = baseURL
    // Make the current user available to all views
    res.locals.user = req.session.user
    next()
  })

  // Register routes
  app.use('/', router)

  // Register error handling middleware
  app.use(errorHandler)

  // Starts the HTTP server listening for connections
  const PORT = process.env.PORT || 3000
  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${server.address().port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}