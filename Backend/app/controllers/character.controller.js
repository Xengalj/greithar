const db = require("../models");
const Character = db.character;
const User = db.user;
const Op = db.Sequelize.Op;

/***************************\
*                           *
*     CHARACTER CREATE      *
*                           *
\***************************/
exports.create = (req, res) => {
  res.status(200).send("Server Character Created");

  Character.create({
    name: req.body.name,
    basics: req.body.basics,
    attributes: req.body.attributes,
    health: req.body.health,
    classes: req.body.classses,
    abilities: req.body.abilites,
    conditions: req.body.conditions,
    skills: req.body.skills,
    coins: req.body.coins,
    inventory: req.body.inventory,
    spells: req.body.spells,
    userSettings: req.body.userSettings
  })
  .then(character => {
    // set owner
    campaign.setUser(req.userId)
    .then(() => {
      res.status(201).send({ message: `${character.name} created successfully!` });
    })
    .catch(err => {
      // error setting user / owner
      res.status(500).send({ message: err.message });
    });
  })
  .catch(err => {
    // error creating character
    res.status(500).send({ message: err.message });
  });
}

/***************************\
*                           *
*      CHARACTER READ       *
*                           *
\***************************/
// returns either a specific character (character_id), a list belonging to a user (user_id), or all characters
exports.read = (req, res) => {
  // get specific character
  if (req.body.character_id) {
    Character.findAll({ where: { id: req.body.character_id }, include: User })
    .then(character => {
      if (!character) { return res.status(404).send({ message: "Character not found!" }); }
      res.status(200).send({ character: character });
    })
    .catch(err => {
      // error getting character
      res.status(500).send({ message: err.message });
    });

  // get user's characters
  } else if (req.body.user_id) {
    Character.findAll({ where: { userId: req.body.user_id }, include: User })
    .then(character => {
      if (!character) { return res.status(404).send({ message: "Character not found!" }); }
      res.status(200).send({ character: character });
    })
    .catch(err => {
      // error getting character
      res.status(500).send({ message: err.message });
    });

  // get all characters
  } else {
    // TODO: Pagination
      // findaAndCountAll //pagination
      /*
      const { count, rows } = await Project.findAndCountAll({
        where: {
          title: {
            [Op.like]: 'foo%',
          },
        },
        offset: 10,
        limit: 2,
      });

      console.log(count);
      console.log(rows);
      */

    Character.findAll({ include: User })
    .then(characters => {
      if (!characters) { return res.status(404).send({ message: "No characters found!" }); }
      res.status(200).send({ characters: JSON.stringify(characters) });
    })
    .catch(err => {
      // error getting characters
      res.status(500).send({ message: err.message });
    });
  }
};

/***************************\
*                           *
*     CHARACTER UPDATE      *
*                           *
\***************************/
// Updates a character, given by character_id
exports.update = (req, res) => {
  // only let users edit their own, or admins edit any
  let isAdmin = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") { isAdmin = true; }
      }
    });
  });

  Character.findOne({ where: { id: req.body.id }, include: User })
  .then(character => {
    if (!character) { return res.status(404).send({ message: "Character not found!" }); }

    // if (isAdmin || req.userId != character.user.id) {
      // set values to be updated
      for (const [key, value] of Object.entries(req.body)) {
        console.log(`${key}: ${value}`);
        character.key = value;
      }
      character.save();
      res.status(200).send({ character });
    // } else {
    //   res.status(403).send({ message: `You do not have permissions to delete this character` });
    // } RELEASE AFTER CONFIRMING character.user.id exists
  })
  .catch(err => {
    // error finding character
    res.status(500).send({ message: err.message });
  });
};

/***************************\
*                           *
*     CHARACTER DELETE      *
*                           *
\***************************/
// Deletes a character
exports.delete = (req, res) => {
  // only let users delete their own, or admins delete any
  let isAdmin = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") { isAdmin = true; }
      }
    });
  });

  Character.findOne({ where: { id: req.body.id }, include: User })
  .then(character => {
    if (!character) { return res.status(404).send({ message: "Character not found!" }); }
    if (isAdmin || req.userId != character.user.id) {
      character.destroy();
      res.status(200).send("Character deleted");
    } else {
      res.status(403).send({ message: `You do not have permissions to delete this character` });
    }
  })
  .catch(err => {
    // error finding character
    res.status(500).send({ message: err.message });
  });
}
