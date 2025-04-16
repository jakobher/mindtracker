/**
 * User model.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, 'Användarnamnet måste vara minst 3 tecken långt'],
    match: [/^[\p{L}0-9_]+$/u, 'Användarnamnet får endast innehålla bokstäver, siffror och understreck']
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'Lösenordet måste vara minst 10 tecken långt']
  }
})

// Add the base schema
schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const User = mongoose.model('User', schema)
