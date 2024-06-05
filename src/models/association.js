import sequelize, { DataTypes } from '../config/database';

const Note = require('../models/note.model')(sequelize, DataTypes);
const User = require('../models/user.model')(sequelize, DataTypes);

User.hasMany(Note, { foreignKey: 'createdBy' });
Note.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = { User, Note };
