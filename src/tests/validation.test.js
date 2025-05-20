// Import Jest testing functions using CommonJS (Windows compatibility)
const { describe, test, expect } = require('@jest/globals')

/**
 * Validates that a password meets the minimum length requirement.
 *
 * This function demonstrates the password validation logic
 * used in AuthController.registerPost method, extracted as a
 * pure function for testing purposes.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is at least 10 characters long, otherwise false.
 */
function validatePasswordLength (password) {
  return password.length >= 10
}

// Tests for the function
describe('Password validation', () => {
  // Test case 1: Valid password with more than 10 characters
  test('should return true for password with 10 or more characters', () => {
    // Arrange: Set up test data with a valid password
    const validPassword = 'validpassword123'

    // Act: Call the function with test data
    const result = validatePasswordLength(validPassword)

    // Assert: Verify the function returns true for valid password
    expect(result).toBe(true)
  })

  // Test case 2: Invalid password with less than 10 characters
  test('should return false for password with less than 10 characters', () => {
    const shortPassword = 'short'
    const result = validatePasswordLength(shortPassword)
    expect(result).toBe(false)
  })

  // Test case 3: Edge case - exactly 10 characters
  test('should return true for exactly 10 characters', () => {
    const password = '1234567890'
    const result = validatePasswordLength(password)
    expect(result).toBe(true)
  })
})
