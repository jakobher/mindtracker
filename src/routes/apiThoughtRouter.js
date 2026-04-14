/**
 * API router for thought challenges (Tankeutmanaren).
 * JWT-protected CRUD routes for the mobile app.
 *
 * @author Jakob Norrgård
 * @version 1.0.0
 */

import express from 'express'
import { Thought } from '../models/ThoughtModel.js'
import { requireApiAuth } from '../middleware/apiAuth.js'

export const router = express.Router()

router.use(requireApiAuth)

// GET /api/thoughts — hämta alla tankar för inloggad användare
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find({ user: req.apiUser.id }).sort({ createdAt: -1 })
    res.json(thoughts)
  } catch {
    res.status(500).json({ message: 'Kunde inte hämta tankar.' })
  }
})

// POST /api/thoughts — spara ny utmanad tanke
router.post('/', async (req, res) => {
  try {
    const { content, context, category, alternative } = req.body

    if (!content) {
      return res.status(400).json({ message: 'Tanken får inte vara tom.' })
    }

    const thought = new Thought({
      content,
      context,
      category,
      alternative,
      user: req.apiUser.id
    })

    await thought.save()
    res.status(201).json(thought)
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(e => e.message).join(' ')
      return res.status(400).json({ message })
    }
    res.status(500).json({ message: 'Kunde inte spara tanken.' })
  }
})

// DELETE /api/thoughts/:id — ta bort tanke
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.id, user: req.apiUser.id })

    if (!thought) {
      return res.status(404).json({ message: 'Tanken hittades inte.' })
    }

    res.json({ message: 'Tanken har tagits bort.' })
  } catch {
    res.status(500).json({ message: 'Kunde inte ta bort tanken.' })
  }
})
