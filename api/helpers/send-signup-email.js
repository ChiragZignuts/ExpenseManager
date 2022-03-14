const nodemailer = require('nodemailer');

module.exports = {
  friendlyName: 'Send signup email',

  description: '',

  inputs: {
    to: {
      type: 'string',
      required: true,
    },
    fname: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  // set host and port
  fn: async function (inputs) {
    var transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'ff7bab71f9b4e7',
        pass: '5e8b0f65e087ac',
      },
    });

    // set details to send
    var data = {
      from: 'expensemanager@gmail.com',
      to: inputs.to,
      subject: 'Welcome Email',
      html:
        '<h3>Hello ' + inputs.fname + ',</h3> <br>Welcome to Expense Manager.',
    };

    // sending email
    transport.sendMail(data, (error) => {
      if (error) {
        return res.status(resCode.SERVER_ERROR).json({
          error: error.message,
        });
      }
    });
  },
};
