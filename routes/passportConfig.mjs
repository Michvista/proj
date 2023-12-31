import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

export default (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3080/auth/google/callback',
        passReqToCallback: true
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          let existingUser = await User.findOne({ 'google.id': profile.id });

          // if user exists, return the user
          if (existingUser) {
            return done(null, existingUser);
          }

          // if user does not exist, create a new user
          console.log('Creating new user...');
          const newUser = new User({
            method: 'google',
            google: {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value
            }
          });
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
