/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'POST /signup': 'UserController.userSignUp',
  'POST /signin': 'UserController.userSignIn',
  'POST /logout': 'UserController.userLogout',

  'GET /user/accounts': 'AccountController.getAllAccounts',
  'GET /user/accounts/:id': 'AccountController.getAccountDetails',
  'POST /user/addAccount': 'AccountController.createAccount',
  'PATCH /user/updateAccount/:id': 'AccountController.updateAccount',
  'DELETE /user/deleteAccount/:id': 'AccountController.deleteAccount',

  'POST /user/accounts/addMember/:id': 'AccountController.addMember',
  'POST /user/accounts/removeMember/:id': 'AccountController.removeMember',

  'POST /user/accounts/addTransaction/:id':
    'TransactionController.addTransaction',
  'GET /user/accounts/transactions/:id':
    'TransactionController.getTransactions',
  'PATCH /user/accounts/updateTransaction/:id':
    'TransactionController.updateTransaction',
  'DELETE /user/accounts/deleteTransaction/:id':
    'TransactionController.deleteTransaction',
};
