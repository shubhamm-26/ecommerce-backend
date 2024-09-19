const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  const { id, emails, displayName } = profile;
  try {
    let user = await User.findOne({ googleId: id });
    if (!user) {
      user = new User({
        name: displayName,
        email: emails[0].value,
        googleId: id,
        password: null
      });
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });


module.exports = passport;