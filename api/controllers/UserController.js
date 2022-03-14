/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const msg = sails.config.messages.User;
const resCode = sails.config.constants.responseCode;

userSignUp = async (req, res) => {
  try {
    // check if user is already exists or not
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(resCode.CONFLICT).json({
        message: msg.DuplicateEmail,
      });
    } else if (req.body.password.length < 8) {
      // check password length
      return res.status(resCode.BAD_REQUEST).json({
        message: msg.PasswordLength,
      });
    } else {
      // password encryption
      bcrypt.hash(req.body.password, 10, async (error, hash) => {
        if (error) {
          return res.status(resCode.SERVER_ERROR).json({
            error: error.message,
          });
        } else {
          // create User
          await User.create({
            email: req.body.email,
            password: hash,
            fname: req.body.fname,
            lname: req.body.lname,
          }).fetch();

          res.status(resCode.CREATED).json({
            message: msg.UserCreated,
          });
        }
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

userSignIn = async (req, res) => {
  try {
    // check email id
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      // compare password
      bcrypt.compare(
        req.body.password,
        user.password,
        async (error, result) => {
          if (error) {
            res.status(resCode.SERVER_ERROR).json({
              error: error.message,
            });
          }
          // generate token
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user.id,
              },
              process.env.JWT_KEY,
              {
                expiresIn: '8h',
              }
            );

            // save token to database
            await User.updateOne({ id: user.id }).set({
              token: token,
            });

            return res.status(resCode.OK).json({
              message: msg.AuthSuccessful,
              token: token,
            });
          }
        }
      );
    } else {
      return res.status(resCode.UNAUTHORIZED).json({
        message: msg.AuthFail,
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

userLogout = async (req, res) => {
  try {
    // check email id
    let user = await User.findOne({ email: req.userData.email });

    // update toke to null
    await User.updateOne({ id: user.id }).set({
      token: null,
    });

    return res.status(resCode.OK).json({
      message: msg.Logout,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

module.exports = {
  userSignUp,
  userSignIn,
  userLogout,
};
