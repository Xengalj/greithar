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

  app.post(
    "/api/character/create",
    [authJwt.verifyToken],    
    controller.create
  );

  app.post(
    "/api/character/read",
    [authJwt.verifyToken],
    controller.read
  );
  
  app.post(
    "/api/character/update",
    [authJwt.verifyToken],
    controller.update
  );

  app.get(
    "/api/character/delete",
    [authJwt.verifyToken],
    controller.delete
  );
};
