'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const phones = require('../db_sample/phones.json');
    phones.map((phone) => {
      delete phone.id;
      phone.createdAt = new Date();
      phone.updatedAt = new Date();
      return phone;
    });

    await queryInterface.bulkInsert('Phones', phones, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Phones', null, {});
  },
};
