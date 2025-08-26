module.exports = (sequelize, Sequelize) => {
  const Campaign = sequelize.define("campaign", {
    name: {
      type: Sequelize.STRING
    },
    notes: {
      type: Sequelize.JSON
    }
  });

  // hasOne ( user )    = owner
  // hasMany ( encounters )
  // hasMany ( characters )

  return Campaign;
};
