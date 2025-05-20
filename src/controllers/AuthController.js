/**
 * Authentication controller.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import { User } from '../models/UserModel.js'
import { Exposure } from '../models/ExposureModel.js'
import { ExposureTemplate } from '../models/ExposureTemplateModel.js'
import bcrypt from 'bcrypt'

/**
 * Hashes the password using bcrypt.
 *
 * @param {string} password - The password to hash
 * @returns {string} The hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

/**
 * Encapsulates a controller.
 */
export class AuthController {
/**
 * Shows profile page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} A promise that resolves when the profile page is rendered.
 */
  async profile (req, res, next) {
    try {
      const user = await User.findById(req.session.user.id)

      if (!user) {
        req.session.flash = {
          type: 'danger',
          message: 'Användaren kunde inte hittas.'
        }
        return res.redirect('/')
      }

      res.render('auth/profile', {
        title: 'Mitt konto',
        user
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays the registration page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async register (req, res, next) {
    try {
      res.render('auth/register')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Registers a new user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} A promise that resolves when the registration page is rendered.
   */
  async registerPost (req, res, next) {
    try {
      // Manual validation of password length before hashing
      if (!req.body.password || req.body.password.length < 10) {
        req.session.flash = {
          type: 'danger',
          message: 'Lösenordet måste vara minst 10 tecken långt.'
        }
        return res.redirect('./register')
      }
      // Hash the password before storing it
      const hashedPassword = await hashPassword(req.body.password)

      // Save user with hashed password
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      })

      await user.save()

      req.session.flash = { type: 'success', message: 'Registrering lyckades! Du kan nu logga in.' }
      res.redirect('/auth/login')
    } catch (error) {
      // Check for duplicate key error. (Username already exists.)
      if (error.code === 11000) {
        req.session.flash = {
          type: 'danger',
          message: 'Användarnamnet finns redan. Vänligen välj ett annat.'
        }
      } else {
        req.session.flash = { type: 'danger', message: error.message }
      }
      res.redirect('./register')
    }
  }

  /**
   * Displays the login page.
   *
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {Function} next - The next middleware function.
   */
  async login (req, res, next) {
    try {
      res.render('auth/login')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the login process.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} A promise that resolves when the login process is complete.
   */
  async loginPost (req, res, next) {
    try {
      // Trim whitespace and ensure input is defined
      const username = (req.body.username || '').trim()
      const password = (req.body.password || '').trim()

      // Handle empty values
      if (!username || !password) {
        req.session.flash = { type: 'danger', message: 'Användarnamn och lösenord måste anges.' }
        return res.redirect('./login')
      }

      // Find user and set to not be case sensitive
      const user = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, 'i') }
      })

      if (!user) {
        req.session.flash = { type: 'danger', message: 'Ogiltigt användarnamn eller lösenord.' }
        return res.redirect('./login')
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      // If password is valid
      if (!isPasswordValid) {
        console.log(`Felaktigt lösenord för '${username}'`)
        req.session.flash = { type: 'danger', message: 'Ogiltigt användarnamn eller lösenord.' }
        return res.redirect('./login')
      }

      // If ok, start session
      req.session.user = {
        id: user._id,
        username: user.username
      }

      req.session.flash = { type: 'success', message: 'Du är nu inloggad!' }
      res.redirect('/')
    } catch (error) {
      req.session.flash = { type: 'danger', message: 'Ett systemfel inträffade. Försök igen senare.' }
      res.redirect('./login')
    }
  }

  /**
   * Logs out the user by destroying the session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      // First try to remove the user from session
      if (req.session.user) {
        delete req.session.user

        // Verify that user was actually removed
        if (!req.session.user) {
          req.session.flash = {
            type: 'success',
            message: 'Du har loggats ut!'
          }
        } else {
          req.session.flash = {
            type: 'danger',
            message: 'Utloggningen misslyckades. Försök igen.'
          }
        }
      }

      res.redirect('/')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Visar sidan för att ta bort konto.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteAccount (req, res, next) {
    try {
      res.render('auth/delete-account')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the deletion of a user account and associated data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} A promise that resolves when the account deletion process is complete.
   */
  async deleteAccountPost (req, res, next) {
    try {
    // Check if user is logged in
      if (!req.session.user || !req.session.user.id) {
        req.session.flash = {
          type: 'danger',
          message: 'Du måste vara inloggad för att ta bort kontot.'
        }
        return res.redirect('/auth/login')
      }

      const userId = req.session.user.id

      // Delete all User data
      try {
        await Exposure.deleteMany({ user: userId })
        await ExposureTemplate.deleteMany({ user: userId })
        await User.deleteOne({ _id: userId })
      } catch (deleteError) {
        console.error('Fel vid borttagning av användardata:', deleteError)
        req.session.flash = {
          type: 'danger',
          message: `Fel vid borttagning av användardata: ${deleteError.message}`
        }
        return res.redirect('/')
      }

      // Set flash message before destroying the session
      req.session.flash = {
        type: 'success',
        message: 'Ditt konto har tagits bort framgångsrikt.'
      }

      // Delete user data from session but keep flash-message
      delete req.session.user

      return res.redirect('/')
    } catch (error) {
      console.error('Generellt fel vid borttagning av konto:', error)
      if (req.session) {
        req.session.flash = {
          type: 'danger',
          message: `Fel vid borttagning av konto: ${error.message}`
        }
      }
      return res.redirect('/')
    }
  }
}
