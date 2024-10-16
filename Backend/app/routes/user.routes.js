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

  // user.create is handled by auth.signup, when done from login screen
  app.post(
    "/api/user/create",
    [
      authJwt.verifyToken,
      authJwt.isSelfOrAdmin
    ],
    controller.create
  );

  // returns a list of users, or if ID was provided, that user
  app.post(
    "/api/user/read",
    [
      authJwt.verifyToken,
      authJwt.isSelfOrAdmin
    ],
    controller.read
  );

  app.post(
    "/api/user/update",
    [
      authJwt.verifyToken,
      authJwt.isSelfOrAdmin
    ],
    controller.update
  );

  app.post(
    "/api/user/delete",
    [
      authJwt.verifyToken,
      authJwt.isSelfOrAdmin
    ],
    controller.delete
  );


  /***************************\
  *                           *
  *      Role Restricted      *
  *                           *
  \***************************/

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

};
