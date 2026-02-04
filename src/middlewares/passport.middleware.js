import passport from "passport";

export const authJWT = passport.authenticate("jwt",{session:false});