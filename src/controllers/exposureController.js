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
      // Get ID 
      console.log('Show method called with ID:', req.params.id);
      console.log('User in session:', req.session.user);

          // Kontrollera om användaren är inloggad
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

      console.log('Found exposure:', exposure);

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
      console.error('Error in show method:', error);
      next(error)
    }
  }
}