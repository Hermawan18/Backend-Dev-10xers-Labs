'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = require('../db_sample/users.json');
    users.map((user) => {
      delete user.id;
      user.password = hashPassword(user.password);
      user.createdAt = new Date();
      user.updatedAt = new Date();
      return user;
    });

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
