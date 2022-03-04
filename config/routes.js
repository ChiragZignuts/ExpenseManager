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
  'POST /signup': 'UserController.UserSignUp',
  'POST /signin': 'UserController.UserSignIn',

  'GET /user/accounts': 'AccountController.GetAllAccounts',
  'GET /user/accounts/:id': 'AccountController.GetAccountDetails',
  'POST /user/addAccount': 'AccountController.CreateAccount',
  'PATCH /user/updateAccount/:id': 'AccountController.UpdateAccount',
  'DELETE /user/deleteAccount/:id': 'AccountController.DeleteAccount',

  'POST /user/accounts/addMember/:id': 'AccountController.AddMember',
  'POST /user/accounts/removeMember/:id': 'AccountController.RemoveMember',

  'POST /user/accounts/addTransaction/:id':
    'TransactionController.AddTransaction',
  'GET /user/accounts/transactions/:id':
    'TransactionController.GetTransactions',
  'PATCH /user/accounts/updateTransaction/:id':
    'TransactionController.UpdateTransaction',
  'DELETE /user/accounts/deleteTransaction/:id':
    'TransactionController.DeleteTransaction',
};
