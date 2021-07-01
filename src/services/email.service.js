const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
<<<<<<< HEAD
const { getVerMailHtml } = require('./emails');
=======
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
<<<<<<< HEAD
    .catch((e) =>
      logger.warn(`Unable to connect to email server. Make sure you have configured the SMTP options in .env\n${e}`)
    );
=======
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
<<<<<<< HEAD
const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
=======
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
<<<<<<< HEAD
  const html = getVerMailHtml(verificationEmailUrl);
  await sendEmail(to, subject, html);
=======
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
>>>>>>> a531d754c3f0eb12475da89319af70a8575cbab2
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
