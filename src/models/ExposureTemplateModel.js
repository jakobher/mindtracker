/**
 * Exposure Template model.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Social interaktion', 'Telefonsamtal', 'Offentligt talande', 'Folksamlingar', 'Annat']
  },
  difficultyLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

schema.add(BASE_SCHEMA)

export const ExposureTemplate = mongoose.model('ExposureTemplate', schema)
