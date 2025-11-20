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
          .then(() => {
            res.status(201).send({ campaign: campaign });
          })
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
exports.readCampaign = (req, res) => {
  // If campaign_id is provided, find that campaign
  if (req.body.campaign_id) {
    Campaign.findOne({ where: { id: req.body.campaign_id }, include: [{ model: Character }, { model: Encounter }] })
    .then(campaign => {
      if (!campaign) { return res.status(404).send({ message: "No campaigns found!" }); }
      res.status(200).send({ campaign: campaign });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

  // If user_id is provided, find that user's campaigns
  } else if (req.body.user_id) {
    Campaign.findAndCountAll({
      where: { userId: req.body.user_id },
      include: [{ model: Character }, { model: Encounter }, { model: User, attributes: ['id', 'username'] }],
      offset: req.body.offset,
      limit: req.body.limit
    })
    .then(campaigns => {
      if (!campaigns) { return res.status(404).send({ message: "No campaigns found!" }); }
      res.status(200).send({ campaigns: campaigns });
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
  console.log("******************** UPDATE CAMPAIGN");
  return res.status(404).send({ message: "Campaign not found!" });


  // set characters (by id array)
  // if (req.body.characters) {
  //   // find all toons where id is = [id array]
  //   Character.findAll({ where: { id: { [Op.or]: req.body.characters } } })
  //   .then( characters => {
  //     campaign.setCharacters(characters)
  //     .then(() => { })
  //     .catch(err => { return res.status(500).send({ message: err.message }); });
  //   })
  // }


  // // only let storytellers edit their own, or admins edit any campaign
  // let isAdmin, isStoryteller = false;
  // User.findByPk(req.userId).then(user => {
  //   user.getRoles().then(roles => {
  //     for (let i = 0; i < roles.length; i++) {
  //       if (roles[i].name === "admin") { isAdmin = true; }
  //       if (roles[i].name === "storyteller") { isStoryteller = true; }
  //     }
  //   });
  // });
  //
  // if (isAdmin || isStoryteller) {
  //   // Find the given campaign by campaign_id
  //   Campaign.findByPk(req.body.campaign_id)
  //   .then(campaign => {
  //     if (!campaign) { return res.status(404).send({ message: "Campaign not found!" }); }
  //     campaign.getUser().then(user => {
  //       if (isAdmin || req.userId != user.id) {
  //         return res.status(401).send({ message: "Only the owner may update their campaign" });
  //       }
  //     });
  //
  //     // get the characters of a campaign
  //     let toons = [];
  //     campaign.getCharacters()
  //     .then(characters => {
  //       for (let i = 0; i < characters.length; i++) {
  //         toons.push(characters[i].id);
  //       }
  //
  //       let newContent = {
  //         name: req.body.name ? req.body.name : campaign.name,
  //         notes: req.body.notes ? req.body.notes : campaign.notes,
  //         characters: req.body.characters ? req.body.characters : toons
  //         // encounters
  //       };
  //
  //       // update campaign with new info
  //       campaign.update({
  //         name: newContent.name,
  //         notes: newContent.notes
  //       })
  //       .then(campaign => {
  //         // Update characters
  //         Character.findAll({ where: { id: { [Op.or]: newContent.characters } } })
  //         .then(characters => {
  //           campaign.setCharacters(characters);
  //
  //           // return new campaign info
  //           res.status(200).send({
  //             id: campaign.id,
  //             name: campaign.name,
  //             characters: campaign.characters
  //             // encounters: campaign.encounters
  //           });
  //         });
  //       })
  //       .catch(err => {
  //         // error updating campaign
  //         res.status(500).send({ message: err.message });
  //       });
  //     })
  //     .catch(err => {
  //       // error getting campaign characters
  //       res.status(500).send({ message: err.message });
  //     });
  //   })
  //   .catch(err => {
  //     // error finding campaign
  //     res.status(500).send({ message: err.message });
  //   });
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
*     ENCOUNTER CREATE      *
*                           *
\***************************/
// creates a blank encounter
exports.createEncounter = (req, res) => {
  console.log("******************** CREATE ENCOUNTER");
  console.log(req.body);
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
  console.log("******************** READ ENCOUNTER");
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
      offset: req.body.offset,
      limit: req.body.limit
    })
    .then(encounters => {
      if (!encounters) { return res.status(404).send({ message: "No encounters found!" }); }
      res.status(200).send({ encounters: encounters });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

  // // find all encounters~
  // } else {
  //   Encounter.findAndCountAll({
  //     include: [{ model: Character }],
  //     offset: req.body.offset,
  //     limit: req.body.limit
  //   })
  //   .then(encounters => {
  //     if (!encounters) { return res.status(404).send({ message: "No encounters found!" }); }
  //     res.status(200).send({ encounters: encounters });
  //   })
  //   .catch(err => { res.status(500).send({ message: err.message }); });
  }
};

/***************************\
*                           *
*     ENCOUNTER UPDATE      *
*                           *
\***************************/
exports.updateEncounter = (req, res) => {
  console.log("******************** UPDATE ENCOUNTER");
  // // only let storytellers edit their own, or admins edit any encounter
  // let isAdmin, isStoryteller = false;
  // User.findByPk(req.userId).then(user => {
  //   user.getRoles().then(roles => {
  //     for (let i = 0; i < roles.length; i++) {
  //       if (roles[i].name === "admin") { isAdmin = true; }
  //       if (roles[i].name === "storyteller") { isStoryteller = true; }
  //     }
  //   });
  // });
  //
  // if (isAdmin || isStoryteller) {
  //   // Find the given encounter by encounter_id
  //   Encounter.findByPk(req.body.encounter_id)
  //   .then(encounter => {
  //     if (!encounter) { return res.status(404).send({ message: "Encounter not found!" }); }
  //     encounter.getUser().then(user => {
  //       if (isAdmin || req.userId != user.id) {
  //         return res.status(401).send({ message: "Only the owner may update their encounter" });
  //       }
  //     });
  //
  //     // get the characters of a encounter
  //     let toons = [];
  //     encounter.getCharacters()
  //     .then(characters => {
  //       for (let i = 0; i < characters.length; i++) {
  //         toons.push(characters[i].id);
  //       }
  //
  //       let newContent = {
  //         name: req.body.name ? req.body.name : encounter.name,
  //         notes: req.body.notes ? req.body.notes : encounter.notes,
  //         characters: req.body.characters ? req.body.characters : toons
  //         // encounters
  //       };
  //
  //       // update encounter with new info
  //       encounter.update({
  //         name: newContent.name,
  //         notes: newContent.notes
  //       })
  //       .then(encounter => {
  //         // Update characters
  //         Character.findAll({ where: { id: { [Op.or]: newContent.characters } } })
  //         .then(characters => {
  //           encounter.setCharacters(characters);
  //
  //           // return new encounter info
  //           res.status(200).send({
  //             id: encounter.id,
  //             name: encounter.name,
  //             characters: encounter.characters
  //             // encounters: encounter.encounters
  //           });
  //         });
  //       })
  //       .catch(err => {
  //         // error updating encounter
  //         res.status(500).send({ message: err.message });
  //       });
  //     })
  //     .catch(err => {
  //       // error getting encounter characters
  //       res.status(500).send({ message: err.message });
  //     });
  //   })
  //   .catch(err => {
  //     // error finding encounter
  //     res.status(500).send({ message: err.message });
  //   });
};

/***************************\
*                           *
*     ENCOUNTER DELETE      *
*                           *
\***************************/
exports.deleteEncounter = (req, res) => {
  console.log("******************** DELETE ENCOUNTER");
  Encounter.findByPk( req.body.id )
  .then(encounter => {
    if (!encounter) { return res.status(404).send({ message: "Encounter not found!" }); }
    let id = encounter.id;
    encounter.destroy();
    res.status(200).send({ message: `Encounter ${id} deleted successfully!` });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};
