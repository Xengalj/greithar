const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get("/api/user/create", controller.create);
  // user.create is handled by auth.signup

  app.post(
    "/api/user/read",
    [authJwt.verifyToken],
    controller.read
  );

  app.post(
    "/api/user/update",
    [authJwt.verifyToken],
    controller.allAccess
  );

  app.get(
    "/api/user/delete",
    [authJwt.verifyToken],
    controller.allAccess
  );

  app.get("/api/user/all", controller.allAccess);

  app.get(
    "/api/user/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/user/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/user/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // app.get(
  //   "/api/data/beastiary",
  //   controller.beastiary
  // )
};
