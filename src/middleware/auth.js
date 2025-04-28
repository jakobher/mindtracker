/**
 * @file authentication middleware.
 * @module middleware/auth
 * @author Jakob Hermansson
 */

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Exposure } from '../models/ExposureModel.js'

const directoryFullName = dirname(fileURLToPath(import.meta.url))

/**
 * Authentication middleware.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    req.session.flash = {
      type: 'danger',
      message: 'Du måste vara inloggad för att se denna sida.'
    }
    res.redirect('/auth/login')
  }
}

/**
 * Authorization middleware to check if the user is the owner of the document.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const isOwner = async (req, res, next) => {
  try {
    // req.doc comes from loadSnippetDocument middleware.
    if (req.doc.user.toString() === req.session.user.id) {
      next()
    } else {
      res
        .status(403)
        .sendFile(join(directoryFullName, '..', 'views', 'errors', '403.html'))
    }
  } catch (error) {
    next(error)
  }
}

// Middleware för att ladda exponeringsövningen innan ägarskapsvalidering
export const loadExposure = async (req, res, next) => {
  try {
    const id = req.params.id
    const exposure = await Exposure.findById(id)

    if (!exposure) {
      req.session.flash = {
        type: 'danger',
        message: 'Resursen kunde inte hittas.'
      }
      return res.redirect('/exposures')
    }

    // Spara dokumentet i req.doc för användning i isOwner och controller
    req.doc = exposure
    next()
  } catch (error) {
    next(error)
  }
}
