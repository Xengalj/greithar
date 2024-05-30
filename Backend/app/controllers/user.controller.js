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

// returns either a list of users, or if a user_id was given, returns that user
exports.read = (req, res) => {
  if (req.user_id) {
    User.findByPK(req.user_id)
      .then(user => {
        if (!users) { return res.status(404).send({ message: "No users found!" }); }
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
