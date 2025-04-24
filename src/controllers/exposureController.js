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

  // Show exposure exercise
  async show(req, res, next) {
    try {
      // Check if user is logged in
    if (!req.session.user) {
      req.session.flash = { 
        type: 'danger', 
        message: 'Du måste vara inloggad för att se denna sida.' 
      };
      return res.redirect('/auth/login');
    }

      const id = req.params.id

      // Find the exercise in the database
      const exposure = await Exposure.findOne({
        _id: id,
        user: req.session.user.id // Make sure exercise belongs to user
      })

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

  async complete(req, res, next) {
    try {
      const id = req.params.id

      // Find the exercise and ensure it belongs to the current user
      const exposure = await Exposure.findOne({
        _id: id,
        user: req.session.user.id
      })

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

  async edit(req, res, next) {
    try {
      const id = req.params.id

      // Find the exercise and ensure it belongs to the current user
      const exposure = await Exposure.findOne({
        _id: id,
        user: req.session.user.id
      })

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

  async update(req, res, next) {
    try {
      const id = req.params.id

      const exposure = await Exposure.findOne({
        _id: id,
        user: req.session.user.id
      })

      if (!exposure) {
        req.session.flash = {
      tyoe: 'danger',
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
}