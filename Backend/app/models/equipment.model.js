module.exports = (sequelize, Sequelize) => {
  const Equipment = sequelize.define("equipment", {
    type: {
      type: Sequelize.STRING
    },
    items: {
      type: Sequelize.JSON
    }
  });

  return Equipment;
};
