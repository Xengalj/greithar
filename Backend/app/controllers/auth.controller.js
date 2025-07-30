const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    usermeta: req.body.usermeta
  })
  .then(user => {
    user.setRoles([3]).then(() => {
      res.send({ message: "User registered successfully!" });
    });
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                // expiresIn: 86400, // 24 hours
                                // expiresIn: 604800, // 1 Week
                                expiresIn: 864000, // 10 Days
                              });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          usermeta: user.usermeta,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
