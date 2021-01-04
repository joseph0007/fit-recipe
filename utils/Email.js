const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, subject) {
    this.to = user.email;
    this.name = user.name;
    this.subject = subject;
    this.from = 'Joseph Joy <josephjoyofficial@gmail.com>';
  }

  getTransporter() {
    return nodemailer.createTransport({
      service: 'Sendgrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASS,
      },
    });
  }

  send(text) {
    return this.getTransporter().sendMail({
      from: this.from,
      to: this.to,
      subject: this.subject,
      text,
    });
  }

  async sendWelcome() {
    await this.send(`Welcome to the fitRecipe family! ${this.name}`);
  }

  async sendResetEmail(url) {
    await this.send(
      `To reset your password please click on this url: ${url} \n If you don't want to reset the password please ignore this message.  `
    );
  }
};
