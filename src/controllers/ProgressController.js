/**
 * Progress controller for tracking user's anxiety exposure progress.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

import { Exposure } from '../models/ExposureModel.js'

/**
 * Encapsulates a controller for progress tracking.
 */
export class ProgressController {
  /**
   * Renders the progress index page with statistics and grouped exposure data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      // Get all completed exercises for this user
      const completedExposures = await Exposure.find({
        user: req.session.user.id,
        completed: true
      }).sort({ date: 1 })

      // Calculate statistics
      const totalCompleted = completedExposures.length
      const averageDifference = this.calculateAverageDifference(completedExposures)

      // Group data (5 per group for easy testing)
      const groupedData = this.groupExposures(completedExposures, 5)

      res.render('progress/index', {
        title: 'Min utveckling',
        totalCompleted,
        averageDifference,
        groupedData,
        exposures: completedExposures
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Calculates the average difference between expected and actual anxiety for exposures.
   *
   * @param {Array} exposures - Array of exposure objects.
   * @returns {number} The average difference rounded to one decimal place.
   */
  calculateAverageDifference (exposures) {
    if (exposures.length === 0) return 0

    let totalDifference = 0
    exposures.forEach(exposure => {
      const difference = exposure.expectedAnxiety - exposure.actualAnxiety
      totalDifference += difference
    })

    return (totalDifference / exposures.length).toFixed(1)
  }

  /**
   * Groups exposures into arrays of a specified size and calculates average statistics for each group.
   *
   * @param {Array} exposures - Array of exposure objects.
   * @param {number} groupSize - The number of exposures per group.
   * @returns {Array} Array of grouped exposure statistics.
   */
  groupExposures (exposures, groupSize) {
    const groupedData = []

    for (let i = 0; i < exposures.length; i += groupSize) {
      const group = exposures.slice(i, i + groupSize)

      // Only create a group if it's complete (has groupSize items)
      // This means we wait for 5 more before creating next group
      if (group.length === groupSize) {
        let expectedSum = 0
        let actualSum = 0
        let peakSum = 0

        group.forEach(exposure => {
          expectedSum += exposure.expectedAnxiety
          actualSum += exposure.actualAnxiety
          peakSum += exposure.peakAnxiety || exposure.actualAnxiety
        })

        groupedData.push({
          groupNumber: Math.floor(i / groupSize) + 1,
          avgExpected: (expectedSum / group.length).toFixed(1),
          avgActual: (actualSum / group.length).toFixed(1),
          avgPeak: (peakSum / group.length).toFixed(1),
          exposureCount: group.length
        })
      }
    }

    return groupedData
  }
}
