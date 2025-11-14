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

db.user       = require("../models/user.model.js")(sequelize, Sequelize);
db.role       = require("../models/role.model.js")(sequelize, Sequelize);
db.character  = require("../models/character.model.js")(sequelize, Sequelize);
db.campaign   = require("../models/campaign.model.js")(sequelize, Sequelize);
db.encounter  = require("../models/encounter.model.js")(sequelize, Sequelize);

// User setup
db.user.belongsToMany(db.role, { through: "user_roles" });
db.user.hasMany(db.character);
db.user.hasMany(db.campaign);

// Role setup
db.role.belongsToMany(db.user, { through: "user_roles" });

// Character setup
db.character.belongsTo(db.user);
db.character.belongsToMany(db.campaign, { through: "campaign_characters" });

// Campaign Seetup
db.campaign.belongsTo(db.user);
db.campaign.belongsToMany(db.character, { through: "campaign_characters" });
db.campaign.hasMany(db.encounter);

// Encounter setup
db.encounter.belongsTo(db.campaign);


module.exports = db;
