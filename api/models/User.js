/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    fname: {
      type: 'string',
      required: true,
    },
    lname: {
      type: 'string',
      required: true,
    },
    token: {
      type: 'string',
      allowNull: true,
    },

    // associations
    account: {
      collection: 'account',
      via: 'owner',
    },
    accounts: {
      collection: 'account',
      via: 'member',
      through: 'useraccount',
    },
    transactions: {
      collection: 'transaction',
      via: 'userId',
    },
  },

  // not display selected fields
  customToJSON: function () {
    return _.omit(this, ['createdAt', 'updatedAt', 'password', 'token']);
  },

  afterCreate: async function (user, proceed) {
    try {
      // Sending SignUp Email
      await sails.helpers.sendSignupEmail.with({
        to: user.email,
        fname: user.fname,
      });

      // Creating Default Account
      await Account.create({
        accName: user.fname + `'s Account`,
        owner: user.id,
      });
    } catch (error) {
      return res.status(resCode.SERVER_ERROR).json({
        error: error.message,
      });
    }
    proceed();
  },
};
