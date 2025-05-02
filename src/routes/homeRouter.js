/**
 * @file Defines the home router.
 * @module routes/homeRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { HomeController } from '../controllers/HomeController.js'

export const router = express.Router()
const controller = new HomeController()

// Map HTTP verbs and route paths to controller methods.
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/get-started', (req, res, next) => controller.getStarted(req, res, next))
