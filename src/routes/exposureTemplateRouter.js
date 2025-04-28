/**
 * @file Defines the exposure template router.
 * @module routes/exposureTemplateRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { ExposureTemplateController } from '../controllers/ExposureTemplateController.js'
import { isAuthenticated } from '../middleware/auth.js'

export const router = express.Router()
const controller = new ExposureTemplateController()

// Protect all routes with authentication middleware
router.use(isAuthenticated)

router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/new', (req, res, next) => controller.new(req, res, next))
router.post('/create', (req, res, next) => controller.create(req, res, next))
