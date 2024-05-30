const { authJwt } = require("../middleware");
const controller = require("../controllers/character.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/character/all", controller.get);

  app.get(
    "/api/character/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/character/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/character/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
