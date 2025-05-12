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
import { router as dashboardRouter } from './dashboardRouter.js'
import { router as progressRouter } from './progressRouter.js'

export const router = express.Router()

// Register routes
router.use('/', homeRouter)
router.use('/auth', authRouter)
router.use('/dashboard', dashboardRouter)
router.use('/exposures', exposureRouter)
router.use('/exposure-templates', exposureTemplateRouter)
router.use('/progress', progressRouter)
