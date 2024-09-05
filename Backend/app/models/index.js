const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.character = require("../models/character.model.js")(sequelize, Sequelize);
// db.race = require("../models/race.model.js")(sequelize, Sequelize);
// db.class = require("../models/class.model.js")(sequelize, Sequelize);
db.equipment = require("../models/equipment.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});
db.ROLES = ["user", "admin", "moderator"];

// db.user.hasMany(db.character, {
//   foreignKey: 'user_id'
// });
db.character.belongsToMany(db.user, {
  through: "user_characters"
});
// db.race.hasMany(db.character, {
//   through: "character_races"
// });
// db.character.belongsToMany(db.class, {
//   through: "character_classes"
// });
// db.class.belongsToMany(db.character, {
//   through: "character_classes"
// });




module.exports = db;
