/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
require('../models/Account');

// Get All Accounts of Signin user
GetAllAccounts = (req, res) => {
  Account.find({ owner: req.userData.userId })
    .then((accounts) => {
      res.status(200).json(accounts);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

GetAccountDetails = (req, res) => {
  accId = req.params.id;
  Account.findOne({ id: accId })
    .populate('owner')
    .populate('members')
    .populate('transactions')
    .then((account) => {
      res.status(200).json({
        account,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

CreateAccount = (req, res) => {
  Account.create({
    accName: req.body.accName,
    balance: req.body.balance,
    owner: req.userData.userId,
  })
    .fetch()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: 'Account Created',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

UpdateAccount = (req, res) => {
  const accId = req.params.id;
  Account.findOne({ id: accId })
    .then((result) => {
      if (req.userData.userId === result.owner) {
        Account.updateOne({ id: accId })
          .set({
            accName: req.body.accName,
          })
          .then((result) => {
            console.log(result);
            res.status(200).json({
              message: 'Account Name Updated Successfully!',
            });
          })
          .catch((err) => {
            res.status(500).json({
              error: err.message,
            });
          });
      } else {
        res.status(403).json({
          message: 'Access Denied',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

DeleteAccount = (req, res) => {
  const accId = req.params.id;
  Account.findOne({ id: accId })
    .then((result) => {
      if (req.userData.userId === result.owner) {
        Transaction.destroy({ accountId: accId })
          .then(() => {
            Account.destroy({ id: accId })
              .fetch()
              .then(() => {
                res.status(200).json({
                  message: 'Account Deleted',
                });
              })
              .catch((err) => {
                res.status(200).json({
                  error: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      } else {
        res.status(403).json({
          message: 'Access Denied',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

AddMember = (req, res) => {
  const accId = req.params.id;
  Account.findOne({ id: accId })
    .then((account) => {
      // console.log('account', account);
      User.findOne({ email: req.body.email })
        .then((record) => {
          // console.log('record', record);
          if (record) {
            if (record.id !== account.owner) {
              UserAccount.find({ member: record.id, account: account.id })
                .then((member) => {
                  // console.log('member', member.length);
                  if (member.length === 0) {
                    Account.addToCollection(accId, 'members')
                      .members([record.id])
                      .then(() => {
                        res.status(200).json({
                          message: 'New Member added',
                        });
                      })
                      .catch((err) => {
                        res.status(500).json({
                          error: err.message,
                        });
                      });
                  } else {
                    res.status(400).json({
                      message: 'Member already added',
                    });
                  }
                })
                .catch((err) => {
                  res.status(500).json({
                    error: err.message,
                  });
                });
            } else {
              return res.status(400).json({
                message: 'Owner cannot be a member',
              });
            }
          } else {
            return res.status(400).json({
              message: 'Email is not exist',
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

RemoveMember = (req, res) => {
  const accId = req.params.id;

  Account.findOne({ id: accId })
    .then((account) => {
      // console.log('account', account);
      User.findOne({ email: req.body.email })
        .then((record) => {
          // console.log('record', record);
          if (record) {
            if (record.id !== account.owner) {
              UserAccount.find({ member: record.id, account: account.id })
                .then((member) => {
                  // console.log('member', member.length);
                  if (member.length !== 0) {
                    Account.removeFromCollection(accId, 'members')
                      .members([record.id])
                      .then(() => {
                        res.status(200).json({
                          message: 'Member removed',
                        });
                      })
                      .catch((err) => {
                        res.status(500).json({
                          error: err.message,
                        });
                      });
                  } else {
                    res.status(400).json({
                      message: 'No member found',
                    });
                  }
                })
                .catch((err) => {
                  res.status(500).json({
                    error: err.message,
                  });
                });
            } else {
              return res.status(400).json({
                message: 'Owner cannot removed',
              });
            }
          } else {
            return res.status(400).json({
              message: 'Email is not exist',
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

module.exports = {
  GetAllAccounts,
  GetAccountDetails,
  CreateAccount,
  UpdateAccount,
  DeleteAccount,
  AddMember,
  RemoveMember,
};
