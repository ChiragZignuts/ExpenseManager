/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    accName: {
      type: 'string',
      required: true,
    },
    balance: {
      type: 'number',
      defaultsTo: 0,
    },

    // associations
    owner: {
      model: 'user',
    },
    members: {
      collection: 'user',
      via: 'account',
      through: 'useraccount',
    },
    transactions: {
      collection: 'transaction',
      via: 'accountId',
    },
  },
};
