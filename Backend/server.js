const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = __dirname + '/app/views/';
const app = express();

/***************************\
*                           *
*       SETUP VARS          *
*                           *
\***************************/
let isProd = 0
let reSeed = 1

if (isProd) { app.use(express.static(path)); }

let corsOptions = { origin: "http://localhost:8081" };
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// database
const db = require("./app/models");
// Database Syncing
if (reSeed) {
  // db.character.drop();
  // force: true will drop the table if it already exists
  db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Database with { force: true }');
    initial();
  });
} else {
  db.sequelize.sync();
}


// simple route
if (isProd) {
  app.get('/', (req, res) => {
    res.sendFile(path + "index.html");
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Greithar's API." });
  });
}

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/character.routes')(app);
require('./app/routes/data.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


/***************************\
*                           *
*         DB INIT           *
*                           *
\***************************/
function initial() {
  db.role.create({ id: 1, name: "admin" });
  db.role.create({ id: 2, name: "storyteller" });
  db.role.create({ id: 3, name: "user" });

  // crete test user with "user" role
  db.user.create({
    id: 1,
    username: "TrevTest",
    email: "trevor@musson.net",
    password: bcrypt.hashSync("pwd4test", 8)
  })
  .then(user => { user.setRoles([3]) });

  // create xen user with all roles
  db.user.create({
    id: 2,
    username: "Xengalj",
    email: "giji4454@gmail.com",
    password: bcrypt.hashSync("Klefki719!", 8)
  })
  .then(user => { user.setRoles([1, 2, 3]) });

  // create eric user with all roles
  db.user.create({
    id: 3,
    username: "Eric",
    email: "eric@awesome.com",
    password: bcrypt.hashSync("pwd4eric", 8)
  })
  .then(user => { user.setRoles([1, 2, 3]) });

  db.character.create({
    id: 0,
    name: "Smelborp",
    attributes: {
      "Str": { "total": 18, "sources": [] }, "StrMod": 4,
      "Dex": { "total": 13, "sources": [] }, "DexMod": 1,
      "Con": { "total": 16, "sources": [] }, "ConMod": 3,
      "Int": { "total": 3, "sources": [] }, "IntMod": -4,
      "Wis": { "total": 11, "sources": [] }, "WisMod": 0,
      "Cha": { "total": 10, "sources": [] }, "ChaMod": -3
    }
  })
  .then(character => { character.setUser(2) });
  db.character.create({
    id: 1,
    name: "Nebtorp",
    magic: {
      "race1": {
        "style": "Spontaneous Arcane",
        "castingAtr": "Cha",
        "galdur": { "total": 195, "currOpen": 50, "currReserve": 50 },
        "casterLevel": 7,
        "concentration": "10 (CL [7] + Cast Abil [3])        CALC",
        "spellsPerDay": [ -1, 7, 7, 5 ],
        "spellsKnown": [
          [ "arcane mark", "light", "mage hand", "mending", "message", "prestidigitation", "read magic" ],
          [ "alarm", "grease", "magic missile", "shield", "true strike" ],
          [ "invisibility", "resist energy", "see invisibility" ],
          [ "dispel magic",
            {
              "Name": "Haste",
              "Description": "",
              "Casting Time": "1 standard action",
              "Components": "V, S, M (a shaving of licorice root)",
              "Range": "Close          CALC",
              "Targets": "one creature/level, no two of which can be more than 30 ft. apart",
              "Duration": "1 round/level",
              "Saving Throw": "Fortitude negates (harmless)",
              "Spell Resistance": "yes (harmless)"
            }
          ]
        ],
      },
      "race2": {
        "style": "Spontaneous Arcane",
        "castingAtr": "Charisma",
        "casterLevel": 17,
        "concentration": "20 (CL [17] + Cast Abil [3])  REMOVE",
        "spellsPerDay": [ -1, -1, -1, -1 ],
        "spellsKnown": [
          [ "detect magic" ],
          [],
          [ "pyrotechnics" ],
          [ "suggestion" ]
        ]
      }
    }
  })
  .then(character => { character.setUser(2) });


}
