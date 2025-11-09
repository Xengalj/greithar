const fs = require('fs');
const Papa = require('papaparse');

const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op; // operators for where clause

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/***************************\
*                           *
*        USER CREATE        *
*                           *
\***************************/
exports.create = (req, res) => {
  let isAdmin = false;
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          isAdmin = true;
        }
      }
    });
  });

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    usermeta: req.body.usermeta
  })
  .then(user => {
    // only let admins set roles, and default with just 'user' role
    if (isAdmin && req.body.roles) {
      Role.findAll({ where: { name: { [Op.or]: req.body.roles } } })
      .then(roles => {
        user.setRoles(roles).then(() => {
          res.status(200).send({ message: `${user.username} registered successfully!` });
        });
      });
    } else {
      user.setRoles([3]).then(() => {
        res.status(200).send({ message: `${user.username} registered successfully!` });
      });
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}

/***************************\
*                           *
*         USER READ         *
*                           *
\***************************/
// returns either a list of users, or if a user_id was given, returns that user
exports.read = (req, res) => {
  // If user_id is provided, find that user
  if (req.body.user_id) {
    User.findOne({ where: { id: req.body.user_id }, include: [{ model: Role }] })
    .then(user => {
      if (!user) { return res.status(404).send({ message: "No users found!" }); }
      res.status(200).send({ data: user });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });

    // find all users
  } else {
    User.findAll({ include: [{ model: Role }] })
    .then(users => {
      if (!users) { return res.status(404).send({ message: "No users found!" }); }
      res.status(200).send({ data: users });
    })
    .catch(err => { res.status(500).send({ message: err.message }); });
  }
};

/***************************\
*                           *
*        USER UPDATE        *
*                           *
\***************************/
exports.update = async (req, res) => {
  let editSelf = (req.userId == req.body.user_id) ? true : false;
  let isAdmin = false;

  // Find the given user by user_id
  User.findOne({ where: { id: req.body.user_id }, include: [{ model: Role }] })
  .then(user => {
    let authorities = [];
    if (!user) { return res.status(404).send({ message: "User not found!" }); }
    // isAdmin Check & log prev roles
    user.roles.forEach(role => {
      authorities.push(role.dataValues.name);
      if (role.dataValues.name === "admin") {
        isAdmin = true;
      }
    });


    if (editSelf || isAdmin) {
      const token = jwt.sign(
        { id: user.id }, config.secret,
        { algorithm: 'HS256', allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      let newContent = {
        username: req.body.username ? req.body.username : user.username,
        email: req.body.email ? req.body.email : user.email,
        usermeta: req.body.usermeta ? req.body.usermeta : user.usermeta,
        roles: (isAdmin && req.body.roles) ? req.body.roles : authorities
      };

      // update user with new info
      user.update({
        username: newContent.username,
        email: newContent.email,
        usermeta: newContent.usermeta
      })
      .then(user => {
        // Update roles
        Role.findAll({ where: { name: { [Op.or]: newContent.roles } } })
        .then(roles => {
          user.setRoles(roles);
          // return new user info
          res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            usermeta: user.usermeta,
            roles: roles,
            token: token
          });
        });
      })
      .catch(err => { res.status(500).send({ message: err.message }); }); // user update catch

    } else {
      return res.status(403).send({ message: "You do not have permission to edit this user" });
    }
  })
  .catch(err => { res.status(500).send({ message: err.message }); }); // user find catch
};

exports.updatePass = async (req, res) => {
  let editSelf = (req.userId == req.body.user_id) ? true : false;
  let isAdmin = false;

  // Find the given user by user_id
  User.findOne({ where: { id: req.body.user_id }, include: [{ model: Role }] })
  .then(user => {
    if (!user) { return res.status(404).send({ message: "User not found!" }); }
    // isAdmin Check
    user.roles.forEach(role => {
      if (role.dataValues.name === "admin") {
        isAdmin = true;
      }
    });
    if (!editSelf || !isAdmin) { return res.status(403).send({ message: "You do not have permission to edit this user" }); }
    // update user password
    user.update({
      password: bcrypt.hashSync(req.body.password, 8)
    })
    .then(user => { res.status(200).send({ message: `${user.username}'s password updated successfully!` }); })
    .catch(err => { res.status(500).send({ message: err.message }); });
  })
  .catch(err => { res.status(500).send({ message: err.message }); }); // user find catch
};

/***************************\
*                           *
*        USER DELETE        *
*                           *
\***************************/
exports.delete = (req, res) => {
  User.findOne({ where: { id: req.body.user_id } })
  .then(user => {
    if (!user) { return res.status(404).send({ message: "User not found!" }); }
    let name = user.username;
    user.destroy();
    res.status(200).send({ message: `${name} delteted successfully!` });
  })
  .catch(err => { res.status(500).send({ message: err.message }); });
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
