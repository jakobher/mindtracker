/**
 * @file Defines the authentication router.
 * @module routes/authRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { AuthController } from '../controllers/authController.js'

export const router = express.Router()
const controller = new AuthController()

// Map HTTP verbs and route paths to controller methods.
router.get('/register', (req, res, next) => controller.register(req, res, next))
router.post('/register', (req, res, next) => controller.registerPost(req, res, next))

// Login routes
router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', (req, res, next) => controller.loginPost(req, res, next))

// Logout route
router.get('/logout', (req, res, next) => controller.logout(req, res, next))