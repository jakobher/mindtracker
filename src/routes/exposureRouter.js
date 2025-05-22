/**
 * @file Defines the exposure router.
 * @module routes/exposureRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { ExposureController } from '../controllers/ExposureController.js'
import { isAuthenticated, isOwner, loadExposure } from '../middleware/auth.js'

export const router = express.Router()
const controller = new ExposureController()

// Skydda alla routes med authentication middleware
router.use(isAuthenticated)

router.get('/exposure', (req, res, next) => controller.dashboard(req, res, next))

// Map HTTP verbs and route paths to controller methods.
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/new', (req, res, next) => controller.new(req, res, next))
router.post('/create', (req, res, next) => controller.create(req, res, next))
router.get('/:id/delete', loadExposure, isOwner, (req, res, next) => controller.renderDelete(req, res, next))
router.get('/:id', loadExposure, isOwner, (req, res, next) => controller.show(req, res, next))

// Route to create exposure from template
router.post('/create-from-template', (req, res, next) => controller.createFromTemplate(req, res, next))

// Route to mark exercise as done
router.post('/:id/complete', loadExposure, isOwner, (req, res, next) => controller.complete(req, res, next))

router.get('/:id/edit', loadExposure, isOwner, (req, res, next) => controller.edit(req, res, next))
router.post('/:id/update', loadExposure, isOwner, (req, res, next) => controller.update(req, res, next))
router.post('/:id/delete', loadExposure, isOwner, (req, res, next) => controller.delete(req, res, next))
