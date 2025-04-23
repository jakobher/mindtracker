/**
 * Home controller.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import { Exposure } from '../models/ExposureModel.js'

export class ExposureController {

  // Displays the page for creating an exposure hierarchy.
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

  // Displays the form for creating a new exposure exercise.
  async new(req, res, next) {
    try {
      res.render('exposure/new', { title: 'Skapa ny exponeringsövning' })
    } catch (error) {
      next (error)
    }
  }

  // Creates a new exposure exercise.
  async create(req, res, next) {
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


}