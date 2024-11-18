// const { authJwt } = require("../middleware");
const fs = require('fs');
const Papa = require('papaparse');

const Armor =     require('../data/equipment/armor.json');
const Shields =   require('../data/equipment/shields.json');
const Simple =    require('../data/equipment/simple.json');
const Martial =   require('../data/equipment/martial.json');
// const Exotic =    require('../data/equipment/exotic.json');
const Materials = require('../data/equipment/materials.json');

// const Alchemy =   require('../data/goods/alchemy.json');
// const Animals =   require('../data/goods/animals.json');
// const Containers = require('../data/goods/containers.json');
// const Gear =      require('../data/goods/gear.json');
// const Services =  require('../data/goods/services.json');

const Rules =   require('../data/rules.json');

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


  /***************************\
  *                           *
  *         EQUIPMENT         *
  *                           *
  \***************************/

  app.post(
    "/api/data/equipment/read",
    (req, res) => {

      // Build weapons object
      let Weapons = {};
      for (const prop in Simple) {
        Weapons[prop] = Simple[prop];
      }
      for (const prop in Martial) {
        Weapons[prop] = Martial[prop];
      }
      // for (const prop in Exotic) {
      //   Weapons[prop] = Exotic[prop];
      // }

      // let goods = { Alchemy };
      let items = { Armor, Shields, Weapons, Materials }; // , goods };
      res.status(200).send(items);
    }
  );


  /***************************\
  *                           *
  *           RULES           *
  *                           *
  \***************************/

  // return the rules json (size, bonus types, damage types)
  app.get(
    "/api/data/rules",
    (req, res) => {
      res.status(200).send(Rules);
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

};
