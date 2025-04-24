/**
 * @file Defines the exposure router.
 * @module routes/exposureRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { ExposureController } from '../controllers/ExposureController.js'
import { isAuthenticated } from '../middleware/auth.js'

export const router = express.Router()
const controller = new ExposureController()

// Skydda alla routes med authentication middleware
router.use(isAuthenticated)

// Map HTTP verbs and route paths to controller methods.
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/new', (req, res, next) => controller.new(req, res, next))
router.post('/create', (req, res, next) => controller.create(req, res, next))
router.get('/:id', (req, res, next) => controller.show(req, res, next))

// Route to mark exercise as done
router.post('/:id/complete', (req, res, next) => controller.complete(req, res, next))
