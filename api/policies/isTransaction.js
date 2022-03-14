const msgAccount = sails.config.messages.Account;
const msgTrans = sails.config.messages.Transaction;
const resCode = sails.config.constants.responseCode;

module.exports = async (req, res, next) => {
  try {
    const transId = req.params.id;
    const userId = req.userData.userId;
    let flag = false;

    // find transaction with transaction id
    let transaction = await Transaction.findOne({ id: transId });

    // if transaction found then proceed else denied
    if (transaction) {
      // find account with account id
      let account = await Account.findOne({
        id: transaction.accountId,
      }).populate('members');

      // if account found then proceed else denied
      if (account) {
        // if user is owner or member of the account then proceed else denied
        if (account.owner === userId) {
          flag = true;
        } else {
          for (member of account.members) {
            if (member.id === userId) {
              flag = true;
              break;
            }
          }
        }

        if (flag) {
          return next();
        } else {
          res.status(resCode.FORBIDDEN).json({
            message: msgAccount.AccessDenied,
          });
        }
      } else {
        res.status(resCode.NOT_FOUND).json({
          message: msgAccount.AccountNotFound,
        });
      }
    } else {
      return res.status(resCode.NOT_FOUND).json({
        message: msgTrans.TransactionNotFound,
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};
