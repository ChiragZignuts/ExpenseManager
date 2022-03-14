/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const msg = sails.config.messages.Account;
const resCode = sails.config.constants.responseCode;

// Get All Accounts of Signin user
getAllAccounts = async (req, res) => {
  try {
    // find all accounts where user is owner
    let owner = await Account.find({ owner: req.userData.userId });

    // find all accounts where user is member
    let member = await UserAccount.find({
      where: { member: req.userData.userId },
      select: ['account'],
    }).populate('account');

    return res.status(resCode.OK).json({
      owner,
      member,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

getAccountDetails = async (req, res) => {
  try {
    accId = req.params.id;

    // find account details by account id
    let account = await Account.findOne({ id: accId })
      .populate('owner')
      .populate('members', { select: ['email'] });

    return res.status(resCode.OK).json({
      account,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

createAccount = async (req, res) => {
  try {
    // create account
    await Account.create({
      accName: req.body.accName,
      balance: req.body.balance,
      owner: req.userData.userId,
    });

    return res.status(resCode.OK).json({
      message: msg.AccountCreated,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

updateAccount = async (req, res) => {
  try {
    const accId = req.params.id;

    // update account with account id
    await Account.updateOne({ id: accId }).set({
      accName: req.body.accName,
    });

    return res.status(resCode.OK).json({
      message: msg.AccountUpdated,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

deleteAccount = async (req, res) => {
  try {
    const accId = req.params.id;

    // delete transaction of the account with account id
    await Transaction.destroy({ accountId: accId });

    // delete account with account id
    await Account.destroy({ id: accId });

    return res.status(resCode.OK).json({
      message: msg.AccountDeleted,
    });
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

addMember = async (req, res) => {
  try {
    const accId = req.params.id;

    // find account with account id
    let account = await Account.findOne({ id: accId });

    // find user with email id
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      // if user found check for user is owner of that account or not
      if (user.id !== account.owner) {
        // if user is not owner check if user is already in the account or not

        // find user as a member of an account
        let member = await UserAccount.findOne({
          member: user.id,
          account: account.id,
        });

        if (!member) {
          // if user is not a member then add it as a member
          await Account.addToCollection(accId, 'members').members([user.id]);

          return res.status(resCode.OK).json({
            message: msg.MemberAdded,
          });
        } else {
          // if user is already a member return duplicate member
          return res.status(resCode.BAD_REQUEST).json({
            message: msg.DuplicateMember,
          });
        }
      } else {
        // if user is owner then return owner cannot be a member
        return res.status(resCode.BAD_REQUEST).json({
          message: msg.OwnerCannotMember,
        });
      }
    } else {
      // return if email is not exist
      return res.status(resCode.BAD_REQUEST).json({
        message: msg.NoEmailFound,
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

removeMember = async (req, res) => {
  try {
    const accId = req.params.id;

    // find account with account id
    let account = await Account.findOne({ id: accId });

    // find user with email id
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      // if user found check for user is owner of that account or not
      if (user.id !== account.owner) {
        // if user is not owner check if user is already in the account or not

        // find user as a member of an account
        let member = await UserAccount.findOne({
          member: user.id,
          account: account.id,
        });

        if (member) {
          // if user is a member then remove it as a member
          await Account.removeFromCollection(accId, 'members').members([
            user.id,
          ]);

          return res.status(resCode.OK).json({
            message: msg.MemberRemoved,
          });
        } else {
          // if user is not a member then return not a member
          return res.status(resCode.BAD_REQUEST).json({
            message: msg.NotAMember,
          });
        }
      } else {
        // if user is owner then return owner cannot removed
        return res.status(resCode.BAD_REQUEST).json({
          message: msg.OwnerCannotRemoved,
        });
      }
    } else {
      // return if email is not exist
      return res.status(resCode.BAD_REQUEST).json({
        message: msg.NoEmailFound,
      });
    }
  } catch (error) {
    return res.status(resCode.SERVER_ERROR).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllAccounts,
  getAccountDetails,
  createAccount,
  updateAccount,
  deleteAccount,
  addMember,
  removeMember,
};
