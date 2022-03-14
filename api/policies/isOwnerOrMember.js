const msg = sails.config.messages.Account;
const resCode = sails.config.constants.responseCode;

module.exports = async (req, res, next) => {
  try {
    const accId = req.params.id;
    const userId = req.userData.userId;
    let flag = false;

    // find account with account id
    let account = await Account.findOne({ id: accId }).populate('members');

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
          message: msg.AccessDenied,
        });
      }
    } else {
      res.status(resCode.NOT_FOUND).json({
        message: msg.AccountNotFound,
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};
