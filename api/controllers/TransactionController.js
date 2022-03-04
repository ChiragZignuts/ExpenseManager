/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

AddTransaction = (req, res) => {
  const accId = req.params.id;

  Account.findOne({ id: accId })
    .then((account) => {
      Transaction.create({
        transDate: new Date(req.body.transDate),
        transName: req.body.transName,
        amount: req.body.amount,
        type: req.body.type,
        description: req.body.description,
        accountId: account.id,
        userId: req.userData.userId,
      })
        .fetch()
        .then((transaction) => {
          // console.log(transaction);
          if (transaction.type === 'income') {
            const updatedBalance = (account.balance += transaction.amount);
            // console.log('updatedBalance: ', updatedBalance);
            Account.updateOne({ id: accId })
              .set({
                balance: updatedBalance,
              })
              .then(() => {
                // console.log(result);
                res.status(200).json({
                  message: 'Transaction added',
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err.message,
                });
              });
          } else if (transaction.type === 'expense') {
            const updatedBalance = (account.balance -= transaction.amount);
            // console.log('updatedBalance: ', updatedBalance);
            Account.updateOne({ id: accId })
              .set({
                balance: updatedBalance,
              })
              .then(() => {
                // console.log(result);
                res.status(200).json({
                  message: 'Transaction added',
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err.message,
                });
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

GetTransactions = (req, res) => {
  Transaction.find({ accountId: req.params.id })
    .populate('accountId')
    .then((transactions) => {
      function compare(a, b) {
        if (a.transDate < b.transDate) {
          return -1;
        }
        if (a.transDate > b.transDate) {
          return 1;
        }
        return 0;
      }
      transactions.sort(compare).reverse();
      res.status(200).json({
        transactions,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
};

UpdateTransaction = (req, res) => {
  const transId = req.params.id;
  Transaction.findOne({ id: transId })
    .then((transaction) => {
      console.log('transaction', transaction);
      const updateOps = {};
      for (const ops of req.body) {
        if (ops.propName === 'transDate') {
          updateOps[ops.propName] = new Date(ops.value);
        } else {
          updateOps[ops.propName] = ops.value;
        }
      }
      updateOps.userId = req.userData.userId;
      Transaction.updateOne({ id: transId })
        .set(updateOps)
        .then((updateTransaction) => {
          console.log('updateOps', updateOps);
          console.log('userId', req.userData.userId);
          console.log('updateTransaction', updateTransaction);

          // find account

          Account.findOne({ id: transaction.accountId })
            .then((account) => {
              // change balance
              console.log('account', account);
              let updatedBalance = account.balance;
              // reverse transaction
              if (transaction.type === 'income') {
                updatedBalance -= transaction.amount;
                console.log('oldBalance', updatedBalance);
              }
              if (transaction.type === 'expense') {
                updatedBalance += transaction.amount;
                console.log('oldBalance', updatedBalance);
              }
              //new transaction
              if (updateTransaction.type === 'income') {
                updatedBalance += updateTransaction.amount;
                console.log('newBalance', updatedBalance);
              }
              if (updateTransaction.type === 'expense') {
                updatedBalance -= updateTransaction.amount;
                console.log('newBalance', updatedBalance);
              }
              // update balance
              Account.updateOne({ id: account.id })
                .set({ balance: updatedBalance })
                .then((result) => {
                  console.log('updatedBalance', result.balance);
                  res.status(200).json({
                    updateTransaction,
                    result,
                  });
                })
                .catch((err) => {
                  res.status(500).json({ error: err.message });
                });
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
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

DeleteTransaction = (req, res) => {
  const transId = req.params.id;
  Transaction.findOne({ id: transId })
    .then(() => {
      Transaction.destroyOne({ id: transId })
        .then((transaction) => {
          console.log(transaction);
          Account.findOne({ id: transaction.accountId })
            .then((account) => {
              let newBalance = account.balance;
              if (transaction.type === 'income') {
                newBalance -= transaction.amount;
                console.log('newBalance', newBalance);
              }
              if (transaction.type === 'expense') {
                newBalance += transaction.amount;
                console.log('newBalance', newBalance);
              }
              Account.updateOne({ id: account.id })
                .set({ balance: newBalance })
                .then((result) => {
                  res.status(200).json({
                    message: 'Transaction Deleted',
                    transaction,
                    result,
                  });
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
  AddTransaction,
  GetTransactions,
  UpdateTransaction,
  DeleteTransaction,
};
