/**
 * @file Defines the dashboard router.
 * @module routes/dashboardRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { DashboardController } from '../controllers/DashboardController.js'
import { isAuthenticated } from '../middleware/auth.js'

export const router = express.Router()
const controller = new DashboardController()

// Skydda alla routes med authentication middleware
router.use(isAuthenticated)

// Map HTTP verbs and route paths to controller methods.
router.get('/exposure', (req, res, next) => controller.exposureDashboard(req, res, next))
