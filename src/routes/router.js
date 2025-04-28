/**
 * @file Main router that handles all routes.
 * @module routes/router
 * @author Jakob Hermansson
 */
import express from 'express'
// import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as authRouter } from './authRouter.js'
import { router as exposureRouter } from './exposureRouter.js'
import { router as exposureTemplateRouter } from './exposureTemplateRouter.js'

export const router = express.Router()

// Register routes
router.use('/', homeRouter)
router.use('/auth', authRouter)
router.use('/exposures', exposureRouter)
router.use('/exposure-templates', exposureTemplateRouter)

// Catch 404 and forward to error handler
// router.use('*', (req, res, next) => {
//   const statusCode = 404
//   const error = new Error(http.STATUS_CODES[statusCode])
//   error.status = statusCode
//   next(error)
// })
