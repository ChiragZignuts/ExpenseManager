/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const msg = sails.config.messages.Transaction;
const resCode = sails.config.constants.responseCode;

addTransaction = async (req, res) => {
  try {
    const accId = req.params.id;

    // find account
    let account = await Account.findOne({ id: accId });

    // check for negative amount
    if (req.body.amount > 0) {
      const transType = req.body.type.toLowerCase();
      const transAmount = parseInt(req.body.amount);
      let updatedBalance = account.balance;

      // check transaction type to update the balance in Account
      if (transType === 'income') {
        // if transaction type is income then transaction value added to the Account balance
        updatedBalance += transAmount;
      } else if (transType === 'expense') {
        // if transaction type is expense then transaction value subtracted from the Account balance
        updatedBalance -= transAmount;
      } else {
        return res.status(resCode.BAD_REQUEST).json({
          message: msg.WrongTransType,
        });
      }

      // add transaction
      await Transaction.create({
        transDate: new Date(req.body.transDate),
        transName: req.body.transName,
        amount: req.body.amount,
        type: req.body.type.toLowerCase(),
        description: req.body.description,
        accountId: account.id,
        userId: req.userData.userId,
      }).fetch();

      // updating Account balance
      await Account.updateOne({ id: account.id }).set({
        balance: updatedBalance,
      });
      return res.status(resCode.OK).json({
        message: msg.TransactionAdded,
      });
    } else {
      return res.status(resCode.BAD_REQUEST).json({
        message: msg.NegativeAmount,
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

getTransactions = async (req, res) => {
  try {
    const accId = req.params.id;

    // find all the transactions from account id
    let transactions = await Transaction.find({ accountId: accId })
      .populate('accountId')
      .populate('userId');

    // sorting
    function compare(a, b) {
      if (a.transDate < b.transDate) {
        return -1;
      }
      if (a.transDate > b.transDate) {
        return 1;
      }
      return 0;
    }

    // sort transactions in descending order
    transactions.sort(compare).reverse();

    return res.status(resCode.OK).json({
      transactions,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

updateTransaction = async (req, res) => {
  try {
    const transId = req.params.id;

    // find transaction with transId
    let transaction = await Transaction.findOne({ id: transId });

    // create an empty object to store dynamic field
    const updateOps = {};
    for (const ops of req.body) {
      if (ops.propName === 'transDate') {
        updateOps[ops.propName] = new Date(ops.value);
      } else {
        updateOps[ops.propName] = ops.value;
      }
    }
    // also add userId in object
    updateOps.userId = req.userData.userId;

    // check negative amount
    if (updateOps.amount) {
      if (updateOps.amount < 0) {
        return res.status(resCode.BAD_REQUEST).json({
          message: msg.NegativeAmount,
        });
      }
    }

    // check transaction type
    if (updateOps.transType) {
      if (
        updateOps.type.toLowerCase() !== 'income' ||
        updateOps.type.toLowerCase() !== 'expense'
      ) {
        return res.status(resCode.BAD_REQUEST).json({
          message: msg.WrongTransType,
        });
      }
    }

    // update transaction
    let updatedTrans = await Transaction.updateOne({
      id: transId,
    }).set(updateOps);

    // find account to update the balance
    let account = await Account.findOne({ id: transaction.accountId });
    let updatedBalance = account.balance;

    // reverse transaction
    if (transaction.type === 'income') {
      updatedBalance -= transaction.amount;
    }
    if (transaction.type === 'expense') {
      updatedBalance += transaction.amount;
    }

    // new transaction
    if (updatedTrans.type === 'income') {
      updatedBalance += updatedTrans.amount;
    }
    if (updatedTrans.type === 'expense') {
      updatedBalance -= updatedTrans.amount;
    }

    // update account balance
    await Account.updateOne({ id: account.id }).set({
      balance: updatedBalance,
    });

    return res.status(resCode.OK).json({
      message: msg.TransactionUpdated,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

deleteTransaction = async (req, res) => {
  try {
    const transId = req.params.id;

    // find transaction with transaction id
    let transaction = await Transaction.findOne({ id: transId });

    // delete transaction with transaction id
    let deletedTrans = await Transaction.destroyOne({ id: transId });

    // find account of that transaction
    let account = await Account.findOne({ id: transaction.accountId });

    // change balance
    let newBalance = account.balance;
    if (deletedTrans.type === 'income') {
      newBalance -= deletedTrans.amount;
    }
    if (deletedTrans.type === 'expense') {
      newBalance += deletedTrans.amount;
    }

    // update balance of Account
    await Account.updateOne({ id: account.id }).set({ balance: newBalance });

    return res.status(resCode.OK).json({
      message: msg.TransactionDeleted,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
