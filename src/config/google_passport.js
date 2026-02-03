import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from 'dotenv';
// import User from '../models/Users/user.model.js';

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: isProd
        ? process.env.GOOGLE_CALLBACK_URL_PROD
        : process.env.GOOGLE_CALLBACK_URL_DEV,
    },
    async (_, __, ___, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase();

        let user = await User.findOne({ $or: [{ googleid: profile.id }, { email }] });

        if (user) {
          if (!user.googleid) {
            user.googleid = profile.id;
            user.name = user.name || profile.displayName;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleid: profile.id,
          name: profile.displayName,
          email,
        });

        return done(null, user);
      } catch (err) {
        console.error("GoogleStrategy error:", err.message);
        return done(err, null);
      }
    }
  )
);