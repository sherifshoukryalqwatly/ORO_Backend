import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (payload,options)=>{
    return jwt.sign(payload,process.env.JWT_SECRET,options);
}

export const verifyToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET)
}

export const decodeToken = (token)=>{
    return jwt.decode(token)
}