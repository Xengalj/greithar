module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    usermeta: {
      type: Sequelize.JSON,
      defaultValue: {
        "faveColor": "#1a8d8d",
        "darkmode": true,
        "hero": {}
      }
    }
  });

  return User;
};
