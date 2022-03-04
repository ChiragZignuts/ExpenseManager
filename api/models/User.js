/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

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

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
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

  afterCreate: async function (user, proceed) {
    try {
      // Sending SignUp Email
      await sails.helpers.sendSignupEmail.with({
        to: user.email,
        fname: user.fname,
      });

      // Creating Default Account
      Account.create({
        accName: user.fname + `'s Account`,
        owner: user.id,
      })
        .fetch()
        .then((result) => {
          console.log(result);
        });
    } catch (err) {
      console.log(err);
    }
    proceed();
  },
};
