/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

UserSignUp = (req, res) => {
  User.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: 'Email already exists',
      });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({
        message: 'Password must be greater than 8 character',
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          User.create({
            email: req.body.email,
            password: hash,
            fname: req.body.fname,
            lname: req.body.lname,
          })
            .fetch()
            .then((result) => {
              console.log(result);
              res.status(201).json({
                message: 'User Created',
              });
            })
            .catch((err) => {
              if (err) {
                return res.status(500).json({
                  error: err,
                });
              }
            });
        }
      });
    }
  });
};

UserSignIn = (req, res) => {
  User.find({ email: req.body.email })
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth Failed',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth Failed',
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '8h',
            }
          );
          return res.status(200).json({
            message: 'Auth Successful',
            token: token,
          });
        }
        res.status(401).json({
          message: 'Auth Failed',
        });
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports = {
  UserSignUp,
  UserSignIn,
};
