/**
 * Dashboard controller.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller for dashboards.
 */
export class DashboardController {
  /**
   * Displays the exposure module dashboard.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async exposureDashboard (req, res, next) {
    try {
      res.render('dashboard/exposure', { title: 'Exponeringsmodul' })
    } catch (error) {
      next(error)
    }
  }
}
