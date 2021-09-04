const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: FireJwtStrategy } = require('passport-custom');
const { auth } = require('./firebase');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// Firebase strategy

const parse = (hdrValue) => {
  if (typeof hdrValue !== 'string') {
    return null;
  }
  const matches = hdrValue.match(/(\S+)\s+(\S+)/);
  return matches && { scheme: matches[1], value: matches[2] };
};

const extractJwt = (req) => {
  let token = null;
  if (req.headers.authorization) {
    const authParams = parse(req.headers.authorization);
    if (authParams && authParams.scheme.toLowerCase() === 'bearer') {
      token = authParams.value;
    }
  }
  return token;
};

const passGen = (len) => {
  let text = '';

  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; ++i) text += charset.charAt(Math.floor(Math.random() * charset.length));
  text += config.firepw;
  return text;
};

const fireJwtVerify = async (req, done) => {
  try {
    const token = extractJwt(req);
    const payload = await auth().verifyIdToken(token);
    if (!payload || !payload.email_verified) {
      return done(null, false);
    }
    let user = await User.findOne({ email: payload.email, method: 'firebase' });
    if (user) {
      return done(null, user);
    }
    const userBody = { email: payload.email, name: payload.name, method: 'firebase', password: passGen(10) };
    user = new User(userBody);
    await user.save();
    done(null, user);
  } catch (e) {
    done(e, false);
  }
};

const fireJwtStrategy = new FireJwtStrategy(fireJwtVerify);

module.exports = {
  jwtStrategy,
  fireJwtStrategy,
};
