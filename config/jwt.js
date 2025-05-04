// config/jwt.js
module.exports = {
  secret: 'tourism_jwt_secret_key',
  refreshSecret: 'tourism_refresh_secret_key',
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
};
