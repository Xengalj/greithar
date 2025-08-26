const db = require("../models");
const Campaign = db.campaign;
const Character = db.character;
const Encounter = db.encounter;
  const Role = db.role;
const Op = db.Sequelize.Op; // operators for where clause

/***************************\
*                           *
*      CAMPAIGN CREATE      *
*                           *
\***************************/
exports.create = (req, res) => {
  console.log("******************** CREATE CAMPAIGN");
  // only let storytellers create campaigns
  let isStoryteller = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "storyteller") {
          isStoryteller = true;
        }
      }
    });
  });
  if (!isStoryteller) { return res.status(401).send({ message: "Only Storytellers may create campaigns" }); }

  Campaign.create({
    name: req.body.name,
    notes: req.body.notes
  })
  .then(campaign => {
    // set owner
    campaign.setUser(req.userId)
    .then(() => { /* user / owner set successfully */ })
    .catch(err => {
      // error setting user / owner
      res.status(500).send({ message: err.message });
    });

    // set characters (by id array)
    if (req.body.characters) {
      // find all toons where id is = [id array]
      Character.findAll({ where: { id: { [Op.or]: req.body.characters } } })
      .then( characters => {
        campaign.setCharacters(characters)
        .then(() => {
          res.status(200).send({ message: `Campaign registered successfully!` });
        })
        .catch(err => {
          // error setting characters
          res.status(500).send({ message: err.message });
        });
      })
    }
  })
  .catch(err => {
    // error creating campaign
    res.status(500).send({ message: err.message });
  });
}

/***************************\
*                           *
*       CAMPAIGN READ       *
*                           *
\***************************/
// returns either a list of campaigns, or if an id was given, returns that one
exports.read = (req, res) => {
  console.log("******************** READ CAMPAIGN");
  // If campaign_id is provided, find that campaign
  if (req.body.campaign_id) {
    // User.findAll({
    //   include: { all: true }
    // });

    Campaign.findOne({ where: { id: req.body.campaign_id }, include: [{ model: Encounter }, { model: Character }] })
    .then(campaign => {
      if (!campaign) { return res.status(404).send({ message: "No campaigns found!" }); }
      res.status(200).send({ data: campaign });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

    // find all campaigns~
  } else {
    Campaign.findAll({ include: [{ model: Encounter }, { model: Character }] })
    .then(campaigns => {
      if (!campaigns) { return res.status(404).send({ message: "No campaigns found!" }); }
      res.status(200).send({ data: campaigns });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  }
};

/***************************\
*                           *
*      CAMPAIGN UPDATE      *
*                           *
\***************************/
exports.update = (req, res) => {
  console.log("******************** UPDATE CAMPAIGN");

  // only let storytellers edit their own, or admins edit any campaign
  let isAdmin, isStoryteller = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") { isAdmin = true; }
        if (roles[i].name === "storyteller") { isStoryteller = true; }
      }
    });
  });

  if (isAdmin || isStoryteller) {
    // Find the given campaign by campaign_id
    Campaign.findByPk(req.body.campaign_id)
    .then(campaign => {
      if (!campaign) { return res.status(404).send({ message: "Campaign not found!" }); }
      campaign.getUser().then(user => {
        if (isAdmin || req.userId != user.id) {
          return res.status(401).send({ message: "Only the owner may update their campaign" });
        }
      });

      // get the characters of a campaign
      let toons = [];
      campaign.getCharacters()
      .then(characters => {
        for (let i = 0; i < characters.length; i++) {
          toons.push(characters[i].id);
        }

        let newContent = {
          name: req.body.name ? req.body.name : campaign.name,
          notes: req.body.notes ? req.body.notes : campaign.notes,
          characters: req.body.characters ? req.body.characters : toons
          // encounters
        };

        // update campaign with new info
        campaign.update({
          name: newContent.name,
          notes: newContent.notes
        })
        .then(campaign => {
          // Update characters
          Character.findAll({ where: { id: { [Op.or]: newContent.characters } } })
          .then(characters => {
            campaign.setCharacters(characters);

            // return new campaign info
            res.status(200).send({
              id: campaign.id,
              name: campaign.name,
              characters: campaign.characters
              // encounters: campaign.encounters
            });
          });
        })
        .catch(err => {
          // error updating campaign
          res.status(500).send({ message: err.message });
        });
      })
      .catch(err => {
        // error getting campaign characters
        res.status(500).send({ message: err.message });
      });
    })
    .catch(err => {
      // error finding campaign
      res.status(500).send({ message: err.message });
    });
};

/***************************\
*                           *
*        USER DELETE        *
*                           *
\***************************/
exports.delete = (req, res) => {
  console.log("******************** DELETE CAMPAIGN");
  Campaign.findByPk( req.body.id )
  .then(campaign => {
    if (!campaign) { return res.status(404).send({ message: "Campaign not found!" }); }
    let name = campaign.name;
    campaign.destroy();
    res.status(200).send({ message: `${name} delteted successfully!` });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};
