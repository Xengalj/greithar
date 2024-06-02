// const { authJwt } = require("../middleware");
const fs = require('fs');
const Papa = require('papaparse');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // return a json of the beastiary csv in /data
  app.get(
    "/api/data/beastiary",
    (req, res) => {
      Papa.parse(fs.createReadStream("app/data/d20pfsrd-beastiary.csv"), {
        header: true,
        complete: function(results, file) {
          res.status(200).send(results["data"]);
        },
        errors: function(errors, file) {
          res.status(200).send(errors);
        }
      });
    }
  );

  // return the classes json in /data
  app.get(
    "/api/data/classes",
    (req, res) => {
      Papa.parse(fs.createReadStream("app/data/d20pfsrd-beastiary.csv"), {
        header: true,
        complete: function(results, file) {
          res.status(200).send(results["data"]);
        },
        errors: function(errors, file) {
          res.status(200).send(errors);
        }
      });
    }
  );

  // app.post(
  //   "/api/character/read",
  //   [authJwt.verifyToken],
  //   controller.read
  // );
};
