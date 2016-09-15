module.exports = {
  port: process.env.PORT || 3000,
  db: 'mongodb://localhost/express-authentication-jwt',
  secret: process.env.SECRET || "secret thing"

};
