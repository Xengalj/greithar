const { authJwt } = require("../middleware");
const controller = require("../controllers/campaign.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /***************************\
  *                           *
  *         CAMPAIGN          *
  *                           *
  \***************************/
  app.post(
    "/api/campaign/create",
    [ authJwt.verifyToken ],
    controller.createCampaign
  );

  app.post(
    "/api/campaign/read",
    [ authJwt.verifyToken ],
    controller.readCampaign
  );

  app.post(
    "/api/campaign/update",
    [ authJwt.verifyToken ],
    controller.updateCampaign
  );

  app.post(
    "/api/campaign/delete",
    [ authJwt.verifyToken ],
    controller.deleteCampaign
  );

  /***************************\
  *                           *
  *        ENCOUNTERS         *
  *                           *
  \***************************/
  app.post(
    "/api/encounter/create",
    [ authJwt.verifyToken ],
    controller.createEncounter
  );

  app.post(
    "/api/encounter/read",
    [ authJwt.verifyToken ],
    controller.readEncounter
  );

  app.post(
    "/api/encounter/update",
    [ authJwt.verifyToken ],
    controller.updateEncounter
  );

  app.post(
    "/api/encounter/delete",
    [ authJwt.verifyToken ],
    controller.deleteEncounter
  );

};
