const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// user.create is actually handled by auth/signup
/*
const jane = await User.create({ name: 'Jane' });
console.log(jane.toJSON()); // This is good!
*/

// returns either a list of users, or if a user_id was given, returns that user
exports.read = (req, res) => {
  if (req.user_id) {
    User.findByPK(req.user_id)
      .then(user => {
        if (!user) { return res.status(404).send({ message: "No users found!" }); }
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

        const jane = await User.create({ name: 'Jane' });
console.log(jane.name); // "Jane"
console.log(jane.favoriteColor); // "green"
jane.name = 'Jane II';
jane.favoriteColor = 'blue';
await jane.save({ fields: ['name'] });
console.log(jane.name); // "Jane II"
console.log(jane.favoriteColor); // "blue"
// The above printed blue because the local object has it set to blue, but
// in the database it is still "green":
await jane.reload();
console.log(jane.name); // "Jane II"
console.log(jane.favoriteColor); // "green"

        

        User.update({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
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
      } else {
        // user role = 1
        user.setRoles([4]).then(() => {
          res.send({ message: "User registered successfully!" });
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
