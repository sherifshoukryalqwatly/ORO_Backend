import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from "crypto";


dotenv.config();

/* ---------- ACCESS TOKEN ---------- */
export const generateToken = (payload, options = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/* ---------- REFRESH TOKEN ---------- */
export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const hashRefreshToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const verifyToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

export const decodeToken = (token)=>{
    return jwt.decode(token)
}