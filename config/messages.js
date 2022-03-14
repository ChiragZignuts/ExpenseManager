module.exports.messages = {
  User: {
    AuthFail: 'Auth Fail',
    DuplicateEmail: 'Email is already exists',
    PasswordLength: 'Password must be greater than 8 characters',

    UserCreated: 'User Created Successfully!',
    AuthSuccessful: 'Auth Successful',
    Logout: 'Logout Successful',
  },
  Account: {
    AccountNotFound: 'Account not found',
    AccessDenied: 'Access Denied',
    AccessDeniedOwnerOnly: 'Access Denied. Only Owner Can Access!',

    AccountCreated: 'Account Created Successfully',
    AccountUpdated: 'Account Updated Successfully',
    AccountDeleted: 'Account Deleted Successfully',

    NoEmailFound: 'Email is not exist',
    OwnerCannotMember: 'Owner can not be a member of an account',
    DuplicateMember: 'Member Already exist in the account',
    MemberAdded: 'Member Added Successfully',

    NotAMember: 'You are not a member of this account',
    OwnerCannotRemoved: 'Owner can not removed from an account',
    MemberRemoved: 'Member Removed Successfully',
  },
  Transaction: {
    NegativeAmount: 'Amount can not be negative',
    WrongTransType: 'Please enter proper transaction type',

    TransactionAdded: 'Transaction Added Successfully',
    TransactionUpdated: 'Transaction Updated Successfully',
    TransactionDeleted: 'Transaction Deleted Successfully',

    TransactionNotFound: 'Transaction not found',
  },
};
