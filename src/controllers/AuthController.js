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
   * Displays the login page.
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
 * Hanterar borttagning av användarkontot.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
  async deleteAccountPost (req, res, next) {
    try {
      if (!req.session.user) {
        req.session.flash = {
          type: 'danger',
          message: 'Du måste vara inloggad för att ta bort kontot.'
        }
        return res.redirect('/auth/login')
      }

      // Delete all data from user
      await Exposure.deleteMany({ user: req.session.user.id })
      await ExposureTemplate.deleteMany({ user: res.session.user.id })

      // Delete the account
      await User.deleteOne({ _id: req.session.user.id })

      // Destroy the session
      req.session.destroy(err => {
        if (err) {
          console.error('Ett fel uppstod vid borttagning av sessionen:', err)
        }

        res.redirect('/')
      })
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: `Fel vid borttagning av konto: ${error.message}`
      }
      res.redirect('/auth/profile')
    }
  }
}
