/**
 * Home controller.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import { Exposure } from '../models/ExposureModel.js'

/**
 * Controller for handling exposure exercises.
 *
 * @class ExposureController
 */
export class ExposureController {
  /**
   * Displays the page for creating an exposure hierarchy.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      // Get the users exposure-exercises from the database
      const exposures = await Exposure.find({ user: req.session.user.id })

      res.render('exposure/index', {
        title: 'Exponeringsövningar',
        exposures
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays the form for creating a new exposure exercise.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async new (req, res, next) {
    try {
      res.render('exposure/new', { title: 'Skapa ny exponeringsövning' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new exposure exercise.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const exposure = new Exposure({
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        expectedAnxiety: req.body.expectedAnxiety,
        user: req.session.user.id
      })

      await exposure.save()

      req.session.flash = {
        type: 'success',
        message: 'Exponeringsövningen har skapats!'
      }

      res.redirect('/exposures')
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message
      }
      res.redirect('./new')
    }
  }

  /**
   * Creates a new exposure exercise from a template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createFromTemplate (req, res, next) {
    try {
      const exposure = new Exposure({
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        expectedAnxiety: req.body.expectedAnxiety,
        template: req.body.templateId,
        user: req.session.user.id
      })

      await exposure.save()

      req.session.flash = {
        type: 'success',
        message: 'Exponeringsövningen har skapats från mallen!'
      }

      res.redirect('/exposures')
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message
      }
      res.redirect('/exposure-templates')
    }
  }

  /**
   * Displays the details of a specific exposure exercise.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Renders the exposure details page or redirects if not found.
   */
  async show (req, res, next) {
    try {
      const id = req.params.id

      const exposure = await this.findUserExposure(id, req.session.user.id)

      // If exercise could not be found, send error message
      if (!exposure) {
        req.session.flash = {
          type: 'danger',
          message: 'Exponeringsövningen hittades inte.'
        }
        return res.render('/exposures')
      }

      // Render details view with details data
      res.render('exposure/show', {
        title: exposure.title,
        exposure
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Shows profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Redirects or renders based on completion.
   */
  async complete (req, res, next) {
    try {
      const id = req.params.id

      const exposure = await this.findUserExposure(id, req.session.user.id)

      if (!exposure) {
        req.session.flash = {
          type: 'danger',
          message: 'Exponeringsövningen hittades inte.'
        }
        return res.redirect('/exposures')
      }

      // Update the exersice with completion data
      exposure.completed = true
      exposure.actualAnxiety = req.body.actualAnxiety
      exposure.peakAnxiety = req.body.peakAnxiety
      exposure.comment = req.body.comment

      await exposure.save()

      req.session.flash = {
        type: 'success',
        message: 'Exponeringsövningen har markerats som genomförd!'
      }

      res.redirect(`/exposures/${id}`)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Shows profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Renders the edit exposure page or redirects if not found.
   */
  async edit (req, res, next) {
    try {
      const id = req.params.id

      const exposure = await this.findUserExposure(id, req.session.user.id)

      if (!exposure) {
        req.session.flash = {
          type: 'danger',
          message: 'Exponeringsövningen hittades inte.'
        }
        return res.redirect('/exposures')
      }

      res.render('exposure/edit', {
        title: `Redigera ${exposure.title}`,
        exposure
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Shows profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Redirects or renders based on update result.
   */
  async update (req, res, next) {
    try {
      const id = req.params.id

      const exposure = await this.findUserExposure(id, req.session.user.id)

      if (!exposure) {
        req.session.flash = {
          type: 'danger',
          message: 'Exponeringsövningen hittades inte.'
        }
        return res.redirect('/exposures')
      }

      // Update fields
      exposure.title = req.body.title
      exposure.location = req.body.location
      exposure.date = req.body.date
      exposure.expectedAnxiety = req.body.expectedAnxiety

      await exposure.save()

      req.session.flash = {
        type: 'success',
        message: 'Exponeringsövningen har uppdaterats!'
      }

      res.redirect(`/exposures/${id}`)
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message
      }
      res.redirect(`/exposures/${req.params.id}/edit`)
    }
  }

  /**
   * Shows profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Renders the delete exposure page or redirects if not found.
   */
  async renderDelete (req, res, next) {
    try {
      const id = req.params.id
      const exposure = await this.findUserExposure(id, req.session.user.id)

      if (!exposure) {
        req.session.flash = {
          type: 'danger',
          message: 'Exponeringsövningen hittades inte.'
        }
        return res.redirect('/exposures')
      }

      res.render('exposure/delete', {
        title: `Ta bort ${exposure.title}`,
        exposure,
        csrfToken: req.csrfToken()
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Shows profile page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      const id = req.params.id
      const exposure = await this.findUserExposure(id, req.session.user.id)

      if (!exposure) {
        req.session.flash = {
          type: 'danger',
          message: 'Exponeringsövningen hittades inte eller kunde inte tas bort.'
        }
      } else {
      // Delete exercise when found
        await exposure.deleteOne()
        req.session.flash = {
          type: 'success',
          message: 'Exponeringsövningen har tagits bort!'
        }
      }

      res.redirect('/exposures')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Helper method to find an exposure exercise for a specific user.
   *
   * @param {string} exposureId - The ID of the exposure exercise.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object|null>} The exposure exercise if found, otherwise null.
   */
  async findUserExposure (exposureId, userId) {
    return await Exposure.findOne({
      _id: exposureId,
      user: userId
    })
  }
}
