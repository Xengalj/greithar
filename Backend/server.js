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

  db.character.create()
  .then(character => { character.setUser(2) });

  db.character.create({
    name: "Smelborp",
    basics : {
      "cr": 0,
      "size": "medium",
      "race": "Zikaru",
      "type": {
        "name": "humanoid",
        "hd": 0,
        "levels": 0,
        "subtypes": [ "human" ]
      },
      "speed": {
        "base": { "total": 30, "sources": [ "Racial Base" ] },
        "swim": { "total": 0, "sources": [] },
        "climb": { "total": 0, "sources": [] },
        "fly": { "total": 0, "sources": [] },
        "burrow": { "total": 0, "sources": []  }
      },
      "alignment": "CG",
      "backstory": "ITS SMELBORP",
      "appearance": { "age": 27, "gender": "male", "height": "7'2\"", "weight": "240 lbs." },
      "diety": "Thor",
      "environment": "Mountains",
      "favoredClass": { "name": "Barbarian", "bonus": "+1 HP per Level" }
    },
    attributes: {
      "Str": { "base": 18 },
      "Dex": { "base": 13 },
      "Con": { "base": 16 },
      "Int": { "base": 6 },
      "Wis": { "base": 11 },
      "Cha": { "base": 10 }
    }
  })
  .then(character => { character.setUser(2) });


}
