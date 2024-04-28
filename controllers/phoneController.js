const { Phone } = require('../models');

class phoneController {
  static async getAllPhones(req, res) {
    try {
      const phones = await Phone.findAll();
      res.status(200).json(phones);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = phoneController;
