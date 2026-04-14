/**
 * API router for exposure exercises.
 * JWT-protected CRUD routes for the mobile app.
 *
 * @author Jakob Norrgård
 * @version 1.0.0
 */

import express from 'express'
import { Exposure } from '../models/ExposureModel.js'
import { requireApiAuth } from '../middleware/apiAuth.js'

export const router = express.Router()

router.use(requireApiAuth)

// GET /api/exposures — hämta alla övningar för inloggad användare
router.get('/', async (req, res) => {
  try {
    const exposures = await Exposure.find({ user: req.apiUser.id }).sort({ createdAt: -1 })
    res.json(exposures)
  } catch {
    res.status(500).json({ message: 'Kunde inte hämta övningar.' })
  }
})

// POST /api/exposures — skapa ny övning
router.post('/', async (req, res) => {
  try {
    const { title, location, date, expectedAnxiety, comment, template } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Titel måste anges.' })
    }

    const exposure = new Exposure({
      title,
      location: location || '',
      date: date ? new Date(date) : new Date(),
      expectedAnxiety: expectedAnxiety ?? 5,
      comment,
      template,
      user: req.apiUser.id
    })

    await exposure.save()
    res.status(201).json(exposure)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(e => e.message).join(' ')
      return res.status(400).json({ message })
    }
    res.status(500).json({ message: 'Kunde inte spara övningen.' })
  }
})

// PUT /api/exposures/:id — uppdatera övning (t.ex. markera genomförd)
router.put('/:id', async (req, res) => {
  try {
    const exposure = await Exposure.findOne({ _id: req.params.id, user: req.apiUser.id })

    if (!exposure) {
      return res.status(404).json({ message: 'Övningen hittades inte.' })
    }

    const allowed = ['title', 'location', 'date', 'expectedAnxiety', 'actualAnxiety', 'peakAnxiety', 'comment', 'completed']
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        exposure[field] = req.body[field]
      }
    })

    await exposure.save()
    res.json(exposure)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(e => e.message).join(' ')
      return res.status(400).json({ message })
    }
    res.status(500).json({ message: 'Kunde inte uppdatera övningen.' })
  }
})

// DELETE /api/exposures/:id — ta bort övning
router.delete('/:id', async (req, res) => {
  try {
    const exposure = await Exposure.findOneAndDelete({ _id: req.params.id, user: req.apiUser.id })

    if (!exposure) {
      return res.status(404).json({ message: 'Övningen hittades inte.' })
    }

    res.json({ message: 'Övningen har tagits bort.' })
  } catch {
    res.status(500).json({ message: 'Kunde inte ta bort övningen.' })
  }
})
