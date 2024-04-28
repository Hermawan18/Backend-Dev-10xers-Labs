const { User } = require('../models');
const { signToken } = require('../helpers/jwt');
const { comparePassword } = require('../helpers/bcrypt');

class userController {
  static async login(req, res, next) {
    try {
      const { name, password } = req.body;

      const user = await User.findOne({ where: { name } });
      if (!user) {
        throw { name: 'NotFound' };
      }

      const checkPassword = comparePassword(password, user.password);
      if (!checkPassword) {
        throw { name: 'Unauthorized' };
      }

      const access_token = signToken({ id: user.id, name: user.name, role: user.role });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
