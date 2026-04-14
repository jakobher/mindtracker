/**
 * API router for authentication.
 * Handles JWT-based auth for the mobile app.
 *
 * @author Jakob Norrgård
 * @version 1.0.0
 */

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/UserModel.js'

export const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const username = (req.body.username || '').trim()
    const password = (req.body.password || '').trim()

    if (!username || !password) {
      return res.status(400).json({ message: 'Användarnamn och lösenord måste anges.' })
    }

    const existing = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    })

    if (existing) {
      return res.status(409).json({ message: 'Användarnamnet är redan taget.' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ username, password: hashedPassword })
    await user.save()

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.status(201).json({ token, username: user.username })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map(e => e.message).join(' ')
      return res.status(400).json({ message })
    }
    res.status(500).json({ message: 'Ett systemfel inträffade.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const username = (req.body.username || '').trim()
    const password = (req.body.password || '').trim()

    if (!username || !password) {
      return res.status(400).json({ message: 'Användarnamn och lösenord måste anges.' })
    }

    const user = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    })

    if (!user) {
      return res.status(401).json({ message: 'Ogiltigt användarnamn eller lösenord.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ogiltigt användarnamn eller lösenord.' })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({ token, username: user.username })
  } catch (error) {
    res.status(500).json({ message: 'Ett systemfel inträffade.' })
  }
})
