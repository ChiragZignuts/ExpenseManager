/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': true,

  UserController: {
    userLogout: 'isLoggedIn',
  },
  AccountController: {
    getAccountDetails: ['isLoggedIn', 'isOwnerOrMember'],
    updateAccount: ['isLoggedIn', 'isOwner'],
    deleteAccount: ['isLoggedIn', 'isOwner'],
    addMember: ['isLoggedIn', 'isOwner'],
    removeMember: ['isLoggedIn', 'isOwner'],
    '*': 'isLoggedIn',
  },
  TransactionController: {
    addTransaction: ['isLoggedIn', 'isOwnerOrMember'],
    getTransactions: ['isLoggedIn', 'isOwnerOrMember'],
    updateTransaction: ['isLoggedIn', 'isTransaction'],
    deleteTransaction: ['isLoggedIn', 'isTransaction'],
    '*': 'isLoggedIn',
  },
};
