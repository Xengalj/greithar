const db = require("../models");
const Campaign = db.campaign;
const Encounter = db.encounter;
const User = db.user;
const Character = db.character;
const Op = db.Sequelize.Op;

/***************************\
*                           *
*      CAMPAIGN CREATE      *
*                           *
\***************************/
// creates a blank campaign
exports.createCampaign = (req, res) => {
  // only let storytellers create campaigns
  let isAdmin, isStoryteller = false;

  // Find the given user by user_id
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      roles.forEach(role => {
        if (role.dataValues.name === "admin") { isAdmin = true; }
        if (role.dataValues.name === "storyteller") { isStoryteller = true; }
      });

      if (isAdmin || isStoryteller) {
        Campaign.create()
        .then(campaign => {

          // set owner
          campaign.setUser(req.userId)
          .then(() => { res.status(201).send({ campaign: campaign }); })
          .catch(err => { res.status(500).send({ message: err.message }); })
        })
        .catch(err => { res.status(500).send({ message: err.message }); });

      } else { return res.status(401).send({ message: "Only Storytellers may create campaigns" }); }
    })
    .catch(err => { return res.status(500).send({ message: err.message }); });
  })
  .catch(err => { return res.status(500).send({ message: err.message }); });
};

/***************************\
*                           *
*       CAMPAIGN READ       *
*                           *
\***************************/
// returns either a list of campaigns, or if an id was given, returns that one
exports.readCampaign = async (req, res) => {
  // If campaign_id is provided, find that campaign
  if (req.body.campaign_id) {
    Campaign.findOne({ where: { id: req.body.campaign_id }, include: [{ model: Encounter }] })
    .then(async campaign => {
      if (!campaign) { return res.status(404).send({ message: "No campaigns found!" }); }

      // create custom array for campaign.characters
      campaign.dataValues.characters = [];
      const characters = await campaign.getCharacters();
      for (const character of characters) {
        await character.getUser()
        .then(user => {
          let toon = {
            id: character.id,
            name: character.name,
            user: user.username,
            color: user.usermeta.faveColor,
            classes: []
          };
          for (let [name, cClass] of Object.entries(character.classes)) {
            toon.classes.push({'name': name, 'levels': cClass.levels});
          }
          campaign.dataValues.characters.push(toon);
        })
        .catch(err => { res.status(500).send({ message: err.message }); });
      }
      res.status(200).send({ campaign: campaign });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

  // If user_id is provided, find that user's campaigns
  } else if (req.body.user_id) {
    Campaign.findAndCountAll({
      where: { userId: req.body.user_id },
      include: [{ model: Character, attributes: ['name'] }, { model: Encounter }, { model: User, attributes: ['id', 'username'] }],
      offset: req.body.offset,
      limit: req.body.limit
    })
    .then(campaigns => {
      if (!campaigns) { return res.status(404).send({ message: "No campaigns found!" }); }
      res.status(200).send({ campaigns: JSON.stringify(campaigns) });
      // res.status(200).send({ campaigns: JSON.stringify(campaigns) });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

  // If campaign_name is provided, search for that campaign
  } else if (req.body.campaign_name) {
    Campaign.findAll({ where: { name: req.body.campaign_name }, include: [{ model: User, attributes: ['id', 'username'] }] })
    .then(campaigns => {
      if (!campaigns) { return res.status(404).send({ message: "No campaigns found!" }); }
      res.status(200).send({ campaigns: campaigns });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

  // find all campaigns~
  } else {
    Campaign.findAndCountAll({
      include: [{ model: Character }, { model: Encounter }, { model: User, attributes: ['id', 'username'] }],
      offset: req.body.offset,
      limit: req.body.limit
    })
    .then(campaigns => {
      if (!campaigns) { return res.status(404).send({ message: "No campaigns found!" }); }
      res.status(200).send({ campaigns: JSON.stringify(campaigns) });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  }
};

/***************************\
*                           *
*      CAMPAIGN UPDATE      *
*                           *
\***************************/
exports.updateCampaign = (req, res) => {
  let isAdmin = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") { isAdmin = true; }
      }

      Campaign.findOne({ where: { id: req.body.campaign.id } })
      .then(campaign => {
        if (!campaign) { return res.status(404).send({ message: "Campaign not found!" }); }

        // only let users edit their own, or admins edit any
        if (isAdmin || campaign.userId == req.userId) {

          for (const [key, value] of Object.entries(req.body.campaign)) {
            // console.log(`${key}: ${value}`);
            if (["id"].includes(key)) { continue; }
            // if (isAdmin && key == "user") { campaign.setUser(value.id); }
            campaign[key] = value;
          }
          campaign.save();

          res.status(200).send({ campaign });
        } else {
          res.status(403).send({ message: `You do not have permission to update this campaign` });
        }
      })
      .catch(err => { res.status(500).send({ message: err.message }); });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};

// Add a single character to a campaign
exports.joinCampaign = (req, res) => {
  Campaign.findOne({ where: { id: req.body.campaign_id}, include: [{ model: Character }] })
  .then(campaign => {
    if (!campaign) { return res.status(404).send({ message: "Campaign not found!" }); }

    if (req.body.character_id) {
      // get current characters
      let toons = [];
      campaign.characters.forEach(character => {
        toons.push(character.dataValues.id);
      });

      // if character isn't yet added, add em
      if (!toons.includes(req.body.character_id)) {
        console.log('toon not yet added');
        Character.findByPk( req.body.character_id )
        .then( char => {
          campaign.addCharacter(char);
          campaign.extras.playerNotes[req.body.character_id] = {};
          campaign.save();
          res.status(200).send({ message: `${char.name} added successfully!` });
        });

      } else { res.status(200).send({ warning: `You may only add a character once` }); }
    } else { res.status(200).send({ warning: `character_id is required` }); }
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};

/***************************\
*                           *
*      CAMPAIGN DELETE      *
*                           *
\***************************/
exports.deleteCampaign = (req, res) => {
  Campaign.findByPk( req.body.id )
  .then(campaign => {
    if (!campaign) { return res.status(404).send({ message: "Campaign not found!" }); }
    let name = campaign.name;
    campaign.destroy();
    res.status(200).send({ message: `${name} deleted successfully!` });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};

/***************************\
*                           *
*       GET LOOT LOCK       *
*                           *
\***************************/
exports.getLock = (req, res) => {
  console.log("******************** GET LOOT LOCK");
  // { id: #, username: xx, color: user.meta.fave }
  return res.status(404).send({ message: "GET LOOT LOCK NOT SET UP!" });
};

/***************************\
*                           *
*       SET LOOT LOCK       *
*                           *
\***************************/
exports.setLock = (req, res) => {
  console.log("******************** SET LOOT LOCK");
  return res.status(404).send({ message: "SET LOOT LOCK NOT SETUP!" });
};







/***************************\
*                           *
*     ENCOUNTER CREATE      *
*                           *
\***************************/
// creates a blank encounter
exports.createEncounter = (req, res) => {
  // only let storytellers create encounters
  let isAdmin, isStoryteller = false;

  // Find the given user by user_id
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      roles.forEach(role => {
        if (role.dataValues.name === "admin") { isAdmin = true; }
        if (role.dataValues.name === "storyteller") { isStoryteller = true; }
      });

      if (isAdmin || isStoryteller) {
        if (req.body.campaign_id) {
          Encounter.create()
          .then(encounter => {
            encounter.setCampaign(req.body.campaign_id)
            .then(() => {
              res.status(201).send({ encounter: encounter });
            })
            .catch(err => { res.status(500).send({ message: err.message }); });
          })
          .catch(err => { return res.status(500).send({ message: err.message }); });

        } else { return res.status(400).send({ message: "Encounters require campaigns" }); }
      } else { return res.status(401).send({ message: "Only Storytellers may create encounters" }); }

    })
    .catch(err => { return res.status(500).send({ message: err.message }); });
  })
  .catch(err => { return res.status(500).send({ message: err.message }); });
};

/***************************\
*                           *
*      ENCOUNTER READ       *
*                           *
\***************************/
// returns either a list of encounters, or if an id was given, returns that one
exports.readEncounter = (req, res) => {
  // If encounter_id is provided, find that encounter
  if (req.body.encounter_id) {
    Encounter.findOne({ where: { id: req.body.encounter_id } })
    .then(encounter => {
      if (!encounter) { return res.status(404).send({ message: "No encounters found!" }); }
      res.status(200).send({ encounter: encounter });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

  // If campaign_id is provided, find that campaign's encounters
  } else if (req.body.campaign_id) {
    Encounter.findAndCountAll({
      where: { campaignId: req.body.campaign_id },
      // include: [{ model: Character }],
      order: [ ['id', 'DESC'] ],
      offset: req.body.offset,
      limit: req.body.limit
    })
    .then(encounters => {
      if (!encounters) { return res.status(404).send({ message: "No encounters found!" }); }
      res.status(200).send({ encounters: encounters });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

  // find all encounters~
  } else {
    Encounter.findAndCountAll({
      include: [{ model: Character }],
      offset: req.body.offset,
      limit: req.body.limit
    })
    .then(encounters => {
      if (!encounters) { return res.status(404).send({ message: "No encounters found!" }); }
      res.status(200).send({ encounters: encounters });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  }
};

/***************************\
*                           *
*     ENCOUNTER UPDATE      *
*                           *
\***************************/
exports.updateEncounter = (req, res) => {
  console.log("******************** UPDATE ENCOUNTER");
  // return res.status(404).send({ message: "UPDATE ENCOUNTER NOT SETUP!" });

  let isAdmin, isStoryteller = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") { isAdmin = true; }
        if (roles[i].name === "storyteller") { isStoryteller = true; }
      }

      Encounter.findOne({ where: { id: req.body.encounter.id } })
      .then(encounter => {
        if (!encounter) { return res.status(404).send({ message: "Encounter not found!" }); }

        // only let users edit their own, or admins edit any
        if (isAdmin || isStoryteller) {
          console.log('update');

          for (const [key, value] of Object.entries(req.body.encounter)) {
            console.log(`${key}: ${value}`);
            if (key == "id") { continue; }
            encounter[key] = value;
          }
          encounter.save();

          res.status(200).send({ encounter });
        } else {
          res.status(403).send({ message: `You do not have permission to update this encounter` });
        }
      })
      .catch(err => { res.status(500).send({ message: err.message }); });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};

/***************************\
*                           *
*     ENCOUNTER DELETE      *
*                           *
\***************************/
exports.deleteEncounter = (req, res) => {
  Encounter.findByPk( req.body.id )
  .then(encounter => {
    if (!encounter) { return res.status(404).send({ message: "Encounter not found!" }); }
    let id = encounter.id;
    encounter.destroy();
    res.status(200).send({ message: `Encounter ${id} deleted successfully!` });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};
