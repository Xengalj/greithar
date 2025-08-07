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
let reSeed = 0

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
    basics : {
      "cr": 1,
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
      "alignment": "LG",
      "backstory": "ITS SMELBORP",
      "appearance": { "age": 27, "gender": "male", "height": "7'2\"", "weight": "240 lbs." },
      "diety": "Thor",
      "environment": "Mountains",
      "favoredClass": { "name": "Barbarian", "bonus": "+1 HP per Level" }
    },
    notes : "",
    userSettings : {
      "cardTab": "main",
      "heroPoints": 1,
      "mainSections": [ "defense", "actions", "conditions" ],
      "expandInventory": [ "Equipped", "Armor", "Weapons", "Hands", "Back", "Items" ]
    },
    attributes: {
      "Str": { "base": 18 },
      "Dex": { "base": 13 },
      "Con": { "base": 16 },
      "Int": { "base": 6 },
      "Wis": { "base": 11 },
      "Cha": { "base": 10 }
    },
    health : {
      "damage": 0,
      "nonlethal": 0,
      "total": 14,
      "sources": [ "+1d12", "+2 Con" ]
    },
    classes : {
      "barbarian": {
        "levels": 1
      }
    },
    abilities : {
      "Darkvision": {
        "trigger": "Continuous",
        "description": "Amaru can see in the dark up to 60 feet",
        "benefit": { "target": "senses", "text": "Darkvision 60 ft." },
        "bonuses": {},
        "extras": { "active": true, "showMain": false, "source": "Trait" }
      },
      "Drake Anatomist": {
        "trigger": "Continuous",
        "description": "+1 damage against dragons and +2 Knowledge (arcana) to identify them",
        "benefit": {},
        "bonuses": {},
        "extras": { "active": true, "showMain": false, "source": "Trait" }
      }
    },
    conditions : {},
    skills : {
      "Acrobatics":                   { "ranks": 0, "class": true, "extras": { "notes": "" } },
      "Bluff":                        { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Climb":                        { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Diplomacy":                    { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Disable Device":               { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Disguise":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Escape Artist":                { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Fly":                          { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Heal":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Intimidate":                   { "ranks": 4, "class": true, "extras": { "notes": "Std to demoralize" } },
      "Knowledge (arcana)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (dungeoneering)":    { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (local)":            { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (nature)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (planes)":           { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (religion)":         { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Perception":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Ride":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Sense Motive":                 { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Spellcraft":                   { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Stealth":                      { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Survival":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Swim":                         { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Use Magic Device":             { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Appraise":                     { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Artistry":                     { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
      "Craft":                        { "ranks": 0, "class": false, "extras": { "notes": "", "specialty": "" } },
      "Handle Animal":                { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (engineering)":      { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (geography)":        { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (history)":          { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Knowledge (nobility)":         { "ranks": 0, "class": false, "extras": { "notes": "" } },
      "Linguistics":                  { "ranks": 0, "class": false, "extras": { "notes": "", "languages": [ "Common", "Risko" ] } },
      "Lore":                         { "ranks": 0, "class": false, "extras": { "notes":  "", "specialty": "" } },
      "Perform":                      { "ranks": 0, "class": false, "extras": { "notes":  "", "specialty": "" } },
      "Profession":                   { "ranks": 0, "class": false, "extras": { "notes":  "", "specialty": "" } },
      "Sleight of Hand":              { "ranks": 0, "class": false, "extras": { "notes": "" }  }
    },
    inventory : [ { "label": "Magic Items", "extras": { "icon": "amulet" }, "children": [ { "label": "Head", "extras": { "capacity": 1 }, "children": [] }, { "label": "Headband", "extras": { "capacity": 1 }, "children": [] }, { "label": "Eyes", "extras": { "capacity": 1 }, "children": [] }, { "label": "Shoulders", "extras": { "capacity": 1 }, "children": [] }, { "label": "Neck", "extras": { "capacity": 1 }, "children": [] }, { "label": "Chest", "extras": { "capacity": 1 }, "children": [] }, { "label": "Body", "extras": { "capacity": 1 }, "children": [] }, { "label": "Belt", "extras": { "capacity": 1 }, "children": [] }, { "label": "Wrists", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 1", "extras": { "capacity": 1 }, "children": [] }, { "label": "Ring 2", "extras": { "capacity": 1 }, "children": [] }, { "label": "Feet", "extras": { "capacity": 1 }, "children": [] }, { "label": "Slotless", "extras": { "capacity": 1 }, "children": [] } ] }, { "label": "Equipped", "extras": { "icon": "equipment" }, "children": [ { "label": "Armor", "extras": { "icon": "armor", "capacity": 1 }, "children": [] }, { "label": "Weapons", "extras": { "icon": "weapons" }, "children": [ { "label": "Hands", "extras": { "icon": "abilityPalm", "capacity": 2 }, "children": [] }, { "label": "Back", "extras": { "icon": "swordShield", "capacity": 2 }, "children": [] } ] } ] }, { "label": "Items", "extras": { "icon": "inventory" }, "children": [ { "label": "Backpack", "extras": { "icon": "backpack", "capacity": 50 }, "children": [] } ] } ],
    coins: { "pp": 0, "gp": 152, "sp": 101, "cp": 21 },
    spells : {}
  })
  .then(character => { character.setUser(2) });


}
