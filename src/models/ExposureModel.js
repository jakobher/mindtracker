/**
 * Exposore model.
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
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  expectedAnxiety: {
    type: Number,
    min: 0,
    max: 10
  },
  actualAnxiety: {
    type: Number,
    min: 0,
    max: 10
  },
  comment: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExposureTemplate'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

schema.add(BASE_SCHEMA)

export const Exposure = mongoose.model('Exposure', schema)
