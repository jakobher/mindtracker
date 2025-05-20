/**
 * ExposureTemplateController.js
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import { Exposure } from '../models/ExposureModel.js'
import { ExposureTemplate } from '../models/ExposureTemplateModel.js'

/**
 * Controller for managing exposure templates.
 */
export class ExposureTemplateController {
  /**
   * Renders a list of exposure templates for the current user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const templates = await ExposureTemplate.find({ user: req.session.user.id })
        .sort({ difficultyLevel: 1 })

      res.render('exposure-templates/index', {
        title: 'Min exponeringsstege',
        templates
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the form to create a new exposure template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async new (req, res, next) {
    try {
      res.render('exposure-templates/new', {
        title: 'Skapa ny mall'
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the creation of a new exposure template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const template = new ExposureTemplate({
        title: req.body.title,
        description: req.body.description,
        difficultyLevel: req.body.difficultyLevel,
        user: req.session.user.id
      })

      await template.save()

      req.session.flash = {
        type: 'success',
        message: 'Mallen har skapats!'
      }

      res.redirect('/exposure-templates')
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message
      }
      res.redirect('./new')
    }
  }

  /**
   * Renders the form to edit an existing exposure template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Returns a promise that resolves when the edit form is rendered or a redirect occurs.
   */
  async edit (req, res, next) {
    try {
      const id = req.params.id

      // Find the template and ensure it belongs to the current user
      const template = await this.findUserTemplate(id, req.session.user.id)

      if (!template) {
        req.session.flash = {
          type: 'danger',
          message: 'Mallen hittades inte.'
        }
        return res.redirect('/exposure-templates')
      }

      res.render('exposure-templates/edit', {
        title: `Redigera ${template.title}`,
        template
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles updating an existing exposure template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Returns a promise that resolves when the update is complete or a redirect occurs.
   */
  async update (req, res, next) {
    try {
      const id = req.params.id

      // Find the template and ensure it belongs to the current user
      const template = await this.findUserTemplate(id, req.session.user.id)

      if (!template) {
        req.session.flash = {
          type: 'danger',
          message: 'Mallen hittades inte.'
        }
        return res.redirect('/exposure-templates')
      }

      // Update fields
      template.title = req.body.title
      template.description = req.body.description
      template.difficultyLevel = req.body.difficultyLevel

      await template.save()

      req.session.flash = {
        type: 'success',
        message: 'Mallen har uppdaterats!'
      }

      res.redirect('/exposure-templates')
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message
      }
      res.redirect('/exposure-templates')
    }
  }

  /**
   * Renders the view to confirm deletion of an exposure template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Returns a promise that resolves when the delete view is rendered or a redirect occurs.
   */
  async deleteTemplateView (req, res, next) {
    try {
      const id = req.params.id

      // Find the template and ensure it belongs to the current user
      const template = await this.findUserTemplate(id, req.session.user.id)

      if (!template) {
        req.session.flash = {
          type: 'danger',
          message: 'Mallen hittades inte.'
        }
        return res.redirect('/exposure-templates')
      }

      // Count exposures using this template
      const exposureCount = await Exposure.countDocuments({
        template: template.id,
        user: req.session.user.id
      })

      res.render('exposure-templates/delete', {
        title: `Ta bort ${template.title}`,
        template,
        exposureCount
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Handles the deletion of an exposure template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Returns a promise that resolves when the deletion is complete or a redirect occurs.
   */
  async delete (req, res, next) {
    try {
      const id = req.params.id

      // Find the template first to verify it exists and belongs to the user
      const template = await this.findUserTemplate(id, req.session.user.id)

      if (!template) {
        req.session.flash = {
          type: 'danger',
          message: 'Mallen hittades inte.'
        }
        return res.redirect('/exposure-templates')
      }

      // Check if there are any exposures using this template
      const exposureCount = await Exposure.countDocuments({
        template: template.id,
        user: req.session.user.id
      })

      if (exposureCount > 0) {
        await Exposure.updateMany(
          { template: template.id, user: req.session.user.id },
          { $unset: { template: '' } }
        )
      }

      // Delete the template
      await ExposureTemplate.deleteOne({ _id: id, user: req.session.user.id })

      req.session.flash = {
        type: 'success',
        message: `Mallen "${template.title}" har tagits bort!${exposureCount > 0 ? ` ${exposureCount} relaterade övningar påverkas inte.` : ''}`
      }

      res.redirect('/exposure-templates')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the form to create a new exposure from a template.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>} Returns a promise that resolves when the form is rendered or a redirect occurs.
   */
  async createExposureForm (req, res, next) {
    try {
      const id = req.params.id

      // Find the template and ensure it belongs to the current user
      const template = await this.findUserTemplate(id, req.session.user.id)

      if (!template) {
        req.session.flash = {
          type: 'danger',
          message: 'Mallen hittades inte.'
        }
        return res.redirect('/exposure-templates')
      }

      res.render('exposure-templates/create-exposure', {
        title: 'Skapa övning från mall',
        template
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Finds an exposure template by ID and user ID.
   *
   * @param {string} id - The ID of the exposure template.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object|null>} The found exposure template or null if not found.
   */
  async findUserTemplate (id, userId) {
    return ExposureTemplate.findOne({
      _id: id,
      user: userId
    })
  }
}
