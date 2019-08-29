const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = require('../models/key.model');

exports.signUp = (req, res) => {
  bcrypt.hash(req.body.password, 10).then(
    (hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword
      });
      user.save()
        .then((createdUser) => {
          res.status(201).json(
            {
              message: 'User added succesfully!',
              res: createdUser
            });
        }).catch(err => {
          console.error(err);
          res.status(500).json({
            message: 'Invalid authentication credentials!'
          })
        })
    }).catch(err => console.error(err));
}

exports.loginUser = (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Forbidden Access'
        })
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)

    }).then((result) => {
      if (!result) {
        return res.status(401).json({
          message: 'Forbidden Access'
        })
      }
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
        key.s_k,
        { expiresIn: "1h" });
      res.status(200).json(
        {
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
        });
    }).catch(err => res.status(500)
      .json(
        {
          message: 'Invalid credentials, try again!'
        }));
}
