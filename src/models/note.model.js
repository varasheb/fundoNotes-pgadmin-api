'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  note.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
      color: {
        type: DataTypes.STRING,
        defaultValue: 'white'
      },
      archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      trashed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'note'
    }
  );
  return note;
};
