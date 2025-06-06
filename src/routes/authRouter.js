/**
 * @file Defines the authentication router.
 * @module routes/authRouter
 * @author Jakob Hermansson
 */

import express from 'express'
import { AuthController } from '../controllers/AuthController.js'
import { isAuthenticated } from '../middleware/auth.js'

export const router = express.Router()
const controller = new AuthController()

// Map HTTP verbs and route paths to controller methods.
router.get('/register', (req, res, next) => controller.register(req, res, next))
router.post('/register', (req, res, next) => controller.registerPost(req, res, next))

router.get('/profile', isAuthenticated, (req, res, next) => controller.profile(req, res, next))

// Login routes
router.get('/login', (req, res, next) => controller.login(req, res, next))
router.post('/login', (req, res, next) => controller.loginPost(req, res, next))

// Delete account routes
router.get('/delete-account', isAuthenticated, (req, res, next) => controller.deleteAccount(req, res, next))
router.post('/delete-account', isAuthenticated, (req, res, next) => controller.deleteAccountPost(req, res, next))

// Logout route
router.get('/logout', (req, res, next) => controller.logout(req, res, next))
