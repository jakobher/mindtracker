/**
 * Home controller.
 *
 * @author Jakob Hermansson
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Displays the home page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      res.render('home/index', {
        title: 'Hem',
        username: req.session.user?.username || null
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Renders the get started page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getStarted (req, res, next) {
    try {
      res.render('home/get-started', { title: 'Kom igång' })
    } catch (error) {
      next(error)
    }
  }
}
