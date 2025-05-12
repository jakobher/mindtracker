/**
 * @file Defines the progress router.
 * @module routes/progressRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { ProgressController } from '../controllers/ProgressController.js'
import { isAuthenticated } from '../middleware/auth.js'

export const router = express.Router()
const controller = new ProgressController()

// Protect all routes with authentication
router.use(isAuthenticated)

// Map HTTP verbs and route paths to controller methods
router.get('/', (req, res, next) => controller.index(req, res, next))
