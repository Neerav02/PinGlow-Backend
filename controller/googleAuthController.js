const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('Google Profile:', profile);
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        console.log('Existing User:', user);
        done(null, user);
      } else {
        console.log('New User - creating account for:', profile.emails[0].value);
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
        console.log('New User created:', user);
        done(null, user);
      }
    } catch (err) {
      console.error('Error during Google strategy callback:', err);
      done(err, null);
    }
  }
));

// Serialize user into the session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user with ID:', id);
  try {
    const user = await User.findById(id);
    console.log('Deserialized user:', user);
    done(null, user);
  } catch (err) {
    console.error('Error during deserialization:', err);
    done(err, null);
  }
});

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res) => {
  // Successful authentication, redirect to frontend or send token
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.redirect(`http://localhost:3000/?token=${token}&user=${JSON.stringify(req.user)}`);
}; 