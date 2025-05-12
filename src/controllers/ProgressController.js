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
     * Displays the progress tracking page with statistics and visualizations
     */
  async index (req, res, next) {
    try {
      // Get all completed exercises for this user
      const completedExposures = await Exposure.find({
        user: req.session.user.id,
        completed: true
      })

      // Calculate simple statistics
      const totalCompleted = completedExposures.length

      // Calculate average difference
      let totalDifference = 0
      completedExposures.forEach(exposure => {
        // How much lower was actual anxiety than expected?
        const difference = exposure.expectedAnxiety - exposure.actualAnxiety
        totalDifference += difference
      })

      const averageDifference = totalCompleted > 0
        ? (totalDifference / totalCompleted).toFixed(1)
        : 0

      res.render('progress/index', {
        title: 'Min utveckling',
        totalCompleted,
        averageDifference,
        exposures: completedExposures
      })
    } catch (error) {
      next(error)
    }
  }
}
