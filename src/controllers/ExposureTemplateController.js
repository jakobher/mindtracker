/**
 * ExposureTemplateController.js
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

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
        category: req.body.category,
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
}
