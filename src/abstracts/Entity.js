// src/abstracts/Entity.js
const { Model } = require('sequelize');

class Entity extends Model {
  static init(attributes, options) {
    options = options || {};
    options.timestamps = true; // Adding common option for timestamps
    return super.init(attributes, options);
  }

  static commonMethod() {
    console.log('This is a common method');
  }

  get commonAttribute() {
    return this.getDataValue('commonAttribute');
  }

  set commonAttribute(value) {
    this.setDataValue('commonAttribute', value);
  }
}

module.exports = Entity;
