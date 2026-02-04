import asyncWrapper from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import bcrypt from 'bcryptjs';
import {generateToken} from '../utils/jwt.js';
import { StatusCodes } from '../utils/constants.js';
import { appResponses } from '../utils/ApiResponse.js';
// import * as userRepo from '../repo/Users/user.repo.js';
import { mailVerification , mailVerification2, sendResetPasswordEmail } from '../utils/email.js';
import { generateOTP } from '../utils/generateOTP.js';
import crypto from 'crypto'
// import { auditLogService } from '../services/System/auditlog.service.js';

const isProd = process.env.NODE_ENV === 'production'

const setAuthCookie = (res,token)=>{
    return res.cookie("access_token",token,{
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
}

// Helper for audit logs
const logAction = async ({ req, user, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: user?._id || user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null
  });
};

export const signIn = asyncWrapper(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw ApiError.badRequest(res,'Email and Passwored are Required / البريد الالكترونى والرقم السرى مطلوبين')
    }
    const existUser = await userRepo.findByEmail(email);
    if(!existUser){
        throw ApiError.notFound('Invalid Email Or Password / البريد الالكترونى او الرقم السرى خطأ')
    }

    const isMatch = bcrypt.compare(password,existUser.password);

    if(!isMatch){
        throw ApiError.unauthorized(res,'Invalid Email Or Password / البريد الالكترونى او الرقم السرى خطأ')
    }

    const token = generateToken({
            id:existUser._id,
            role:existUser.role,
            name:existUser.name,
            email:existUser.email
        },
        { expiresIn: '1d' }
    );

    const {password:_,...safeUser} = existUser.toObject();

    // Audit log
    await logAction({
      req,
      user: existUser,
      action: 'LOGIN',
      targetModel: 'User',
      targetId: existUser._id,
      description: `User ${existUser.email} signed in`
    });

    return setAuthCookie(res,token)
            .status(StatusCodes.OK)
            .json({data:safeUser,token});
})

export const signUp =asyncWrapper(async (req,res,next)=>{

    const {firstName,lastName,email,password,confirmPassword} = req.body;

    if(!firstName||!lastName||!email||!password||!confirmPassword){

        throw ApiError.badRequest("Missing required fields / هنالك حقل مطلوب")
    }
    
    const existUser = await userRepo.findByEmail(email.toLowerCase());
    
    if(existUser){
        throw ApiError.conflict("A user with this email already exists / المستخدم صاحب هذا البريد مسجل بالفعل")
    }

    if(confirmPassword !== password){
        console.log("password",password,"confrirm Password",confirmPassword);
        

        throw ApiError.badRequest('Password is not Math / الرقم السرى غير متطابق');
        
    }
    // 1️⃣ Generate OTP
    const otp = generateOTP(); // ex: 6-digit code
    const otpExpiry = Date.now() + 10 * 60 * 1000; // valid for 10 minutes

    // 2️⃣ Create user with isVerify=false
    const newUser = await userRepo.create({
        ...req.body,
        otp,
        otpExpiry,
    });

    // await mailVerification(email,otp)
    // await mailVerification2(email,otp)

    // Audit log
    await logAction({
      req,
      user: newUser,
      action: 'CREATE',
      targetModel: 'User',
      targetId: newUser._id,
      description: `New user registered with email ${newUser.email}`
    });
    
    return appResponses.success(res,newUser,"User Registered Successfully. OTP sent to email / تم تسجيل المستخدم بنجاح وتم إرسال رمز التحقق إلى البريد",StatusCodes.CREATED)
})

export const verifyOtp = asyncWrapper(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw ApiError.badRequest("Email and OTP are required / البريد الإلكتروني والرمز مطلوبان");
  }

  const user = await userRepo.findByEmail(email.toLowerCase());

  if (!user) {
    throw ApiError.notFound("User not found / المستخدم غير موجود");
  }

  if (user.isVerify) {
    return appResponses.success(res, null, "User already verified / المستخدم مُفعل مسبقاً");
  }

  if (user.otp.toString() !== otp) {
    throw ApiError.badRequest("Invalid OTP / الرمز غير صحيح");
  }

  if (user.otpExpiry < Date.now()) {
    throw ApiError.badRequest("OTP expired / انتهت صلاحية الرمز");
  }

  // Mark user as verified
  await userRepo.update(user._id,{isVerify:true,otp:null,otpExpiry:null});

  // Audit log
  await logAction({
    req,
    user,
    action: 'UPDATE',
    targetModel: 'User',
    targetId: user._id,
    description: `User ${email} verified OTP`
  });

  return appResponses.success(res, null, "User verified successfully / تم تفعيل المستخدم بنجاح");
});

export const resendOtp = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    throw ApiError.badRequest("Email is required / البريد الإلكتروني مطلوب");
  }

  const user = await userRepo.findByEmail(email.toLowerCase());

  if (!user) {
    throw ApiError.notFound("User not found / المستخدم غير موجود");
  }

  if (user.isVerify) {
    return appResponses.success(res, null, "User already verified / المستخدم مُفعل مسبقاً");
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  // Update user
  await userRepo.update(user._id,{otp,otpExpiry})

  // Send OTP email
  await mailVerification(email, otp);

  // Audit log
  await logAction({
    req,
    user,
    action: 'UPDATE',
    targetModel: 'User',
    targetId: user._id,
    description: `OTP resent to user ${email}`
  });

  return appResponses.success(res, null, "New OTP sent successfully / تم إرسال رمز التحقق الجديد بنجاح");
});

export const  requestResetPassword  = asyncWrapper(async (req,res,next)=>{
    const { email } = req.body;

    if (!email) throw AppErrors.badRequest("Email is required / البريد الإلكتروني مطلوب");

    const user = await userRepo.findByEmail(email.toLowerCase());
    if (!user) throw AppErrors.notFound("User not found / المستخدم غير موجود");

    // Generate secure token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    await userRepo.update(user._id,{resetPasswordToken:resetToken,resetPasswordExpiry:expiry})

    // Send token via email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    // Send email
    await sendResetPasswordEmail(email, resetLink);

    // Audit log
    await logAction({
      req,
      user,
      action: 'UPDATE',
      targetModel: 'User',
      targetId: user._id,
      description: `Reset password requested for user ${email}`
    });

    return appResponses.success(res, null, "Reset password email sent");
})

export const resetPassword = asyncWrapper(async (req, res, next) => {
  const { email, token, newPassword, confirmPassword } = req.body;

  if (!email || !token || !newPassword || !confirmPassword)
    throw ApiError.badRequest("All fields are required / كل الحقول مطلوبه");

  if (newPassword !== confirmPassword)
    throw ApiError.badRequest("Passwords do not match / الرقم السرى غير مطابق");

  const user = await userRepo.findByEmail(email.toLowerCase());
  if (!user) throw ApiError.notFound("User not found / المستخدم غير موجود");

  // Validate token
  if (
    user.resetPasswordToken !== token ||
    user.resetPasswordExpiry < Date.now()
  ) {
    throw ApiError.badRequest("Invalid or expired token / الرمز غير صالح أو منتهي الصلاحية");
  }

  // Hash new password
    const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await userRepo.update(user._id,{password:hashedPassword,resetPasswordToken:null,resetPasswordExpiry:null});

  // Audit log
  await logAction({
    req,
    user,
    action: 'UPDATE',
    targetModel: 'User',
    targetId: user._id,
    description: `Password reset for user ${email}`
  });

  return appResponses.success(res, null, "Password reset successfully / تم إعادة تعيين كلمة المرور بنجاح");
});

export const me = asyncWrapper(async (req, res, next) => {
  return appResponses.success(res, req.user, "Authenticated user");
});

export const signOut =asyncWrapper(async (req,res,next)=>{  

    res.clearCookie("access_token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });
    
    return appResponses.success(res, {}, "Successfully logged out / تسجيل الخروج تم بنجاح");
})

export const googleCallback = async (req, res, next) => {
  console.log("googleCallback triggered, req.user:", req.user);
  try {
    if (!req.user) {
      console.error("No user provided by Passport");
      return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
    }

    const user = req.user;
    const token = generateToken({ id: user._id, role: user.role }, { expiresIn: '1d' });
    const { password: _, ...safeUser } = user.toObject();

    console.log("Setting cookie and redirecting for user:", safeUser);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .redirect(`${process.env.CLIENT_URL}`);
  } catch (err) {
    console.error("Google callback error:", err.message);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/login?error=${encodeURIComponent(
        err.message
      )}`
    );
  }
};