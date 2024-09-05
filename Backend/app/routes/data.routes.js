// const { authJwt } = require("../middleware");
const fs = require('fs');
const Papa = require('papaparse');

const ItemController = require("../controllers/equipment.controller");

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
  *         BEASTIARY         *
  *                           *
  \***************************/

  // return a json of the beastiary csv in /data
  app.get(
    "/api/data/beastiary/getAll",
    (req, res) => {
      Papa.parse(fs.createReadStream("app/data/d20pfsrd-beastiary.csv"), {
        header: true,
        dynamicTyping: true,
        complete: function(results, file) {
          res.status(200).send(results["data"]);
        },
        errors: function(errors, file) {
          res.status(200).send(errors);
        }
      });
    }
  );

  // return a single monster from beastiary csv, using it's name
  app.post(
    "/api/data/beastiary/getOne",
    (req, res) => {
      if (!req.body.name) {
        return res.status(404).send({ message: "No monster name provided" });
      }
      let search = req.body.name;

      Papa.parse(fs.createReadStream("app/data/d20pfsrd-beastiary.csv"), {
        header: true,
        dynamicTyping: true,
        complete: function(results, file) {
          results["data"].forEach((monster, i) => {
            if (monster.Name == search) {
              res.status(200).send(JSON.stringify(monster))
            }
          });
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


  /***************************\
  *                           *
  *         EQUIPMENT         *
  *                           *
  \***************************/

  // return a JSON of items, either all or given type
  app.post("/api/data/equipment/read", ItemController.read);

  // update list of items in a given type
  app.post("/api/data/equipment/update", ItemController.update);

  // delete items of a given type
  app.get("/api/data/equipment/delete", ItemController.delete)

};
