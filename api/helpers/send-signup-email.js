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

  fn: async function (inputs) {
    var transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'ff7bab71f9b4e7',
        pass: '5e8b0f65e087ac',
      },
    });

    var data = {
      from: 'expensemanager@gmail.com',
      to: inputs.to,
      subject: 'Welcome Email',
      html:
        '<h3>Hello ' + inputs.fname + ',</h3> <br>Welcome to Expense Manager.',
    };

    console.log(data);

    transport.sendMail(data, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent');
      }
    });
  },
};
