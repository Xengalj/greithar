const fs = require('fs');
const Papa = require('papaparse');

const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op; // operators for where clause

// var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// user.create is actually handled by auth/signup
/*
const jane = await User.create({ name: 'Jane' });
console.log(jane.toJSON()); // This is good!
*/

// returns either a list of users, or if a user_id was given, returns that user
exports.read = (req, res) => {
  // If user_id is provided, find that user
  if (req.body.user_id) {
    User.findOne({ where: { id: req.body.user_id } })
    .then(user => {
      if (!user) { return res.status(404).send({ message: "No users found!" }); }

      let authorities = [];
      user.getRoles()
      .then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          usermeta: user.usermeta,
          roles: authorities
        });
      })
      .catch(err => { res.status(500).send({ message: err.message }); });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

    // find all users
  } else {
    User.findAll()
    .then(users => {
      if (!users) { return res.status(404).send({ message: "No users found!" }); }
      res.status(200).send({
        data: users
      });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  }
};

exports.update = (req, res) => {
  User.findOne({ where: { id: req.body.user_id } })
  .then(user => {
    if (!user) { return res.status(404).send({ message: "User not found!" }); }

    let authorities = [];
    user.getRoles()
    .then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }

      let newContent = {
        username: req.body.username ? req.body.username : user.username,
        password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : user.password,
        email: req.body.email ? req.body.email : user.email,
        usermeta: req.body.usermeta ? req.body.usermeta : user.usermeta,
        roles: req.body.roles ? req.body.roles : user.authorities
      };

      // update user with new info
      user.update({
        username: newContent.username,
        password: newContent.password,
        email: newContent.email,
        usermeta: newContent.usermeta
      })
      .then(user => {
        // Update roles
        if (req.body.roles) {
          Role.findAll({ where: { name: { [Op.or]: req.body.roles } } })
          .then(roles => {
            user.setRoles(roles);

            // return new user info
            res.status(200).send({
              id: user.id,
              username: user.username,
              email: user.email,
              usermeta: user.usermeta,
              roles: authorities,
            });
          });
        }
      })
      .catch(err => { res.status(500).send({ message: err.message }); });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
};











exports.delete = (req, res) => {
  res.status(200).send("Server DELETE USER.");
  // const jane = await User.create({ name: 'Jane' });
  // console.log(jane.name); // "Jane"
  // console.log(jane.toJSON()); // This is good!
  // await jane.destroy();
};


exports.allAccess = (req, res) => {
  res.status(200).send("Server Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("Server User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Server Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Server Moderator Content.");
};
