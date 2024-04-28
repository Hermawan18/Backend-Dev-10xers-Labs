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

  static async createPhone(req, res) {
    try {
      const userId = req.user.id;
      const { brand, model, colors, price, stock } = req.body;

      const newPhone = await Phone.create({ brand, model, colors, price, stock, userId });

      res.status(201).json(newPhone);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = phoneController;
