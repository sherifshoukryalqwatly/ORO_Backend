import express from "express";
import passport from "passport";
import { 
  googleCallback,
  signIn,
  signOut,
  signUp,
  verifyOtp,
  resendOtp,
  requestResetPassword,
  resetPassword,
  me,
  refreshToken
  } from "./auth.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { createUserSchema } from "../validations/user.validation.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.get("/me",isAuthenticated,me);
router.post("/login", signIn);
router.post("/refresh", refreshToken);
router.post("/register", validationMiddleware(createUserSchema), signUp);
router.post("/logout", signOut);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", resetPassword);


// Google OAuth routes
router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
  }),
  googleCallback
);

export default router;