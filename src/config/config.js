const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const isInvalidPath = require('is-invalid-path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const validPath = (value, helpers) => {
  if (isInvalidPath(value, { windows: true })) {
    return helpers.message('Invalid file path!');
  }
  return value;
};

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    MAINTENANCE: Joi.string().default(''),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    EMAIL_NAME: Joi.string(),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    APP_URL: Joi.string().default('https://mage-its.com'),
    FIREBASE_PW: Joi.string(),
    FRONTEND_PATH: Joi.string().custom(validPath),
    CORS_ORIGIN: Joi.string().default('https://mage-its.com'),
    USE_RECAPTCHA: Joi.string().default('false').lowercase(),
    RECAPTCHA_SECRET: Joi.string(),
    LOGGING: Joi.string().default('').lowercase(),
    CLOSE_DEVCOM: Joi.string().default('').lowercase(),
    CLOSE_PROPOSAL: Joi.string().default('').lowercase(),
    CLOSE_OLIM: Joi.string().default('').lowercase(),
    CLOSE_PAYMENT_OLIM: Joi.string().default('').lowercase(),
    CLOSE_SUBMIT_KARYA: Joi.string().default('').lowercase(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      name: envVars.EMAIL_NAME,
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  url: envVars.APP_URL,
  firepw: envVars.FIREBASE_PW,
  frontend: envVars.FRONTEND_PATH,
  cors: envVars.CORS_ORIGIN,
  useRecaptcha: envVars.USE_RECAPTCHA === 'true',
  recaptchaSecret: envVars.RECAPTCHA_SECRET,
  maintenance: envVars.MAINTENANCE,
  logging: envVars.LOGGING === 'true',
  close: {
    olim: envVars.CLOSE_OLIM === 'true',
    devcom: envVars.CLOSE_DEVCOM === 'true',
    proposal: envVars.CLOSE_PROPOSAL === 'true',
    paymentOlim: envVars.CLOSE_PAYMENT_OLIM === 'true',
    submitKarya: envVars.CLOSE_SUBMIT_KARYA === 'true',
  },
};
