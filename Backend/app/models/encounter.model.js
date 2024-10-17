module.exports = (sequelize, Sequelize) => {
  const Encounters = sequelize.define("encounters", {
    creatures: {
      type: Sequelize.JSON
    },
    notes: {
      type: Sequelize.JSON
    }
  });

  return Encounters;
};
