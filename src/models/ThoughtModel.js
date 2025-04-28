/**
 * Thought model.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  context: {
    type: String
  },
  category: {
    type: String,
    enum: ['Catastrophizing', 'Black and White Thinking', 'Fortune Telling', 'Mind Reading', 'Other']
  },
  alternative: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

schema.add(BASE_SCHEMA)

export const Thought = mongoose.model('Thought', schema)
