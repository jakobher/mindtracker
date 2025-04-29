/**
 * ExposureTemplateController.js
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import { Exposure } from '../models/ExposureModel.js'
import { ExposureTemplate } from '../models/ExposureTemplateModel.js'

export class ExposureTemplateController {
  /**
   * Visar exponeringsstegen (lista över mallar ordnade efter svårighet)
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
   * Shows form to create a new template
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
   * Create a new template
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
   * Show details for a specific template
   */
  async show (req, res, next) {
    try {
      const id = req.params.id

      const template = await this.findUserTemplate(id, req.session.user.id)

      if (!template) {
        req.session.flash = {
          type: 'danger',
          message: 'Mallen hittades inte.'
        }
        return res.redirect('/exposure-templates')
      }

      // Find all exposures based on this template
      const exposures = await Exposure.find({
        template: template.id,
        user: req.session.user.id
      }).sort({ date: 1 })

      res.render('exposure-templates/show', {
        title: template.title,
        template,
        exposures
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Show form to edit a template
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
   * Update a template
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

      res.redirect(`/exposure-templates/${id}`)
    } catch (error) {
      req.session.flash = {
        type: 'danger',
        message: error.message
      }
      res.redirect(`/exposure-templates/${req.params.id}/edit`)
    }
  }

  /**
   * Delete a template
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
        req.session.flash = {
          type: 'danger',
          message: 'Det finns övningar kopplade till denna mall. Ta bort dem först.'
        }
        return res.redirect(`/exposure-templates/${id}`)
      }

      // Delete the template
      await template.deleteOne()

      req.session.flash = {
        type: 'success',
        message: 'Mallen har tagits bort!'
      }

      res.redirect('/exposure-templates')
    } catch (error) {
      next(error)
    }
  }

  /**
   * Show form to create a new exposure from a template
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

  // Help method to find template
  async findUserTemplate (id, userId) {
    return ExposureTemplate.findOne({
      _id: id,
      user: userId
    })
  }
}
