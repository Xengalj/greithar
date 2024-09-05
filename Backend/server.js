const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

let reSeed = 0;
if (reSeed) {
  // force: true will drop the table if it already exists
  db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Database with { force: true }');
    initial();
  });
} else {
  db.sequelize.sync();
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Greithar's API." });
});

var bcrypt = require("bcryptjs");
// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
// require('./app/routes/character.routes')(app);
require('./app/routes/data.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Initialize DB
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "moderator"
  });

  Role.create({
    id: 3,
    name: "admin"
  });

  db.user.create({
    id: 1,
    username: "TrevTest",
    email: "trevor@musson.net",
    password: bcrypt.hashSync("pwd4test", 8)
  });
  db.user.create({
    id: 2,
    username: "Xengalj",
    email: "giji4454@gmail.com",
    password: bcrypt.hashSync("Klefki719!", 8)
  });
  db.character.create({
    id: 0,
    user_id: 2, // belongsToMany (char through user_characters)
    name: "Smelborp",
    level: {
      "currentLevel": 1,
      "favoredClassBonus": {
        "class_id": 0,
        "bonus": "+1 HP, Skill, or Galdur per Level"
      },
      "classes": [
        {
          "class_id": 0,
          "levels": 1
        }
      ]
    },
    abilities: [
      { "label": 'Str', "value": 10 },
      { "label": 'Dex', "value": 10 },
      { "label": 'Con', "value": 10 },
      { "label": 'Int', "value": 10 },
      { "label": 'Wis', "value": 10 },
      { "label": 'Cha', "value": 10 }
    ],
    feats: {},
    traits: {},
    role_play: {
      "campaign": "",
      "alignment": "NG",
      "diety": "",
      "appearance": {
        "gender": "",
        "age": 21,
        "height": "",
        "weight": "",
      },
      "backstory": "When I was, a young boy...",
    },
    extras: {
      "heroPoints": 1,
      "notes": "Your notes here...",
    }
  });
  db.equipment.create({
    type: "Currency",
    items: { "platinum": { "value": 10, "weight": 0.02 }, "gold": { "value": 1, "weight": 0.02 }, "silver": { "value": 0.1, "weight": 0.02 }, "copper": { "value": 0.01, "weight": 0.02 } }
  });
}
