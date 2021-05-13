const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: "secretPassword",
  };
  
  passport.use(
    new JwtStrategy(opts, (decoded, done) => {
      console.log("Decode jwt", decoded);
      return done(null, decoded);
    })
  );
};
