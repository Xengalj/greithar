const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op; // operators for where clause

// var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// user.create is actually handled by auth/signup
/*
const jane = await User.create({ name: 'Jane' });
console.log(jane.toJSON()); // This is good!
*/


// exports.read = (req, res) => {
//   res.status(200).send({ message: req.body });
// };

// returns either a list of users, or if a user_id was given, returns that user
exports.read = (req, res) => {
  if (req.body.user_id) {
    User.findOne({
      where: { id: req.body.user_id }
    })
      .then(user => {
        if (!user) { return res.status(404).send({ message: "No users found!" }); }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          // roles: authorities,
          // accessToken: token
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {
    User.findAll()
      .then(users => {
        if (!users) { return res.status(404).send({ message: "No users found!" }); }
        res.status(200).send({
          users: JSON.stringify(users)
        });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  }
};

exports.update = (req, res) => {
  User.findByPK(req.user_id)
    .then(user => {
      if (!users) { return res.status(404).send({ message: "User not found!" }); }
      // update user with new info
      let newContent = {
        username: req.body.username ? req.body.username : user.username,
        email: req.body.email ? req.body.email : user.email,
        password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : user.password,
        roles: req.body.roles ? req.body.roles : user.authorities
      };
      user.update({
        username: newContent.username,
        passwrod: newContent.password,
        email: newContent.email
      })
        .then(user => {
          // Update roles
          if (req.body.roles) {
            Role.findAll({
              where: {
                name: {
                  [Op.or]: req.body.roles
                }
              }
            }).then(roles => {
              user.setRoles(roles).then(() => {
                res.send({ message: "User registered successfully!" });
              });
            });
          }
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });

      // return new user info
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}



exports.delete = (req, res) => {
  res.status(200).send("Server DELETE USER.");
  // const jane = await User.create({ name: 'Jane' });
  // console.log(jane.name); // "Jane"
  // console.log(jane.toJSON()); // This is good!
  // await jane.destroy();
}


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
