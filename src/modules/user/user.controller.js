import { DateTime } from 'luxon';

import { User } from '../../../database/models/user.model.js';
import { catchError } from './../../middlewares/error/catch-error.middleware.js';
import { ApiError } from '../../utils/api-error.utils.js';
import { sendResponse } from '../../utils/send-response.utils.js';
import { generateOTP, sentOTP } from './../../utils/otp.utils.js';
import { generateToken } from '../../utils/token.utils.js';
import { sanitizeUser, sanitizeUserProfile } from '../../utils/sanitize-data.utils.js';
import { sendMails } from '../../services/mail.service.js';
import { MsgHTML } from '../../utils/mail-html.utils.js';
import { bcryptCompare, bcryptHashData, cryptoHashData } from '../../utils/hash-data.utils.js';
import { systemRoles } from '../../utils/constants/system-roles.utils.js';
import { userStatus } from '../../utils/constants/user-status.js';



// ------------------  Auth  ------------------
export const signUpCompany_HR = catchError(async (req, res, next) => {
    req.body.role = systemRoles.COMPANY_HR;
    next();
});

export const signUp = catchError(async (req, res, next) => {
    const { firstName, lastName, email, password, DOB, mobileNumber, role } = req.body;
    // const hashPassword = await bcrypt.hash(password, +process.env.BCRYPT_SALT);
    const hashPassword = bcryptHashData(password);
    // 2- create  inctence from user.
    const user = await User({
        firstName,
        lastName,
        username: `${firstName} ${lastName}`,
        email,
        password: hashPassword,
        DOB,
        mobileNumber,
        role
    });

    // 3- generate OTP
    const confirmationCode = generateOTP();
    user.emailVerifyCode = cryptoHashData(confirmationCode);
    user.emailVerifyExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 4- send confirmation email
    const isEmailSend = await sentOTP({
        to: user.email,
        subject: "Welcome to Job Search App - Verify Your Email",
        otp: confirmationCode,
        userName: user.username,
        textmessage: 'Thank you for choosing our App. Please use the following OTP to complete your sign-up process. The OTP is valid for 10 minutes.',
    });

    if (isEmailSend.rejected.length) {
        user.emailVerifyCode = undefined;
        user.emailVerifyExpires = undefined;
        return next(new ApiError('send verification Email is faild', 500, 'signUp controller'))
    };

    // 4- save user in DB
    const newuser = await user.save();
    return sendResponse(res, { data: sanitizeUser(newuser) }, 201);
});

export const signIn = catchError(async (req, res, next) => {
    const { email, mobileNumber, password } = req.body;
    const user = await User.findOne({
        $or: [
            { email },
            { mobileNumber },
        ]
    });

    // Check if user exists and password is correct
    if (!user || !bcryptCompare(password, user.password)) {
        return next(new ApiError('Incorrect email or password', 401));
    }

    // Generate token for authenticated user
    const token = generateToken({ userId: user._id, role: user.role });

    user.status = userStatus.ONLINE;
    user.logOut = undefined;
    const loggedUser = await user.save();
    return sendResponse(res, { data: sanitizeUser(loggedUser), token });
});

export const logOut = catchError(async (req, res, next) => {
    const { _id } = req.user;
    const now = DateTime.now();  // Create current date and time
    const user = await User.findById(_id);
    if (!user) {
        return next(new ApiError('User not found.', 404, 'logOut controller'));
    }
    user.status = userStatus.OFFLINE;
    user.logOut = now.toString(); // Store logout time as ISO string
    await user.save();
    return sendResponse(res, { message: 'Logged out successfully' });
});


// ------------------  Email Confirmation   ------------------

export const verifyEmail = catchError(async (req, res, next) => {
    const { verifyCode } = req.body;
    const hashVerifyCode = cryptoHashData(verifyCode);

    // get user  based on resetCode
    const user = await User.findOne({
        emailVerifyCode: hashVerifyCode,
        emailVerifyExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError(`verification code invalid or expired`, 400));
    }

    // check if OTP expired
    // const currentTimeAimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
    // const otpExpireAimestamp = Math.floor(user.emailVerifyExpires.getTime() / 1000); // OTP expiration time in seconds
    // if (currentTimeAimestamp > otpExpireAimestamp) {
    //     return next(new ApiError('The virify Code has expired', 400))
    // }

    // 2- verify code valid
    user.isConfirmed = true;
    user.emailVerifyCode = undefined;
    user.emailVerifyExpires = undefined;

    const userUpdated = await user.save();
    return sendResponse(res, { message: 'confirmed', data: sanitizeUser(userUpdated) });
});

export const resendEmailVerifyCode = catchError(async (req, res, next) => {
    const { email } = req.body;
    // 1- get user
    const user = await User.findOne({ email, isConfirmed: false });
    if (!user) {
        return next(new ApiError('Invalid email or user already confirmed', 400))
    }

    // 2- generate OTP
    const confirmationCode = generateOTP();
    user.emailVerifyCode = cryptoHashData(confirmationCode);
    user.emailVerifyExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 3- send  OTP via email
    const isEmailSend = await sentOTP({
        to: user.email,
        subject: "Job Search App- resend your verification code",
        otp: confirmationCode,
        userName: user.username,
        textmessage: 'Please use the following OTP to complete your sign-up process. The OTP is valid for 10 minutes.',
    });

    if (isEmailSend?.rejected.length) {
        user.emailVerifyCode = undefined;
        user.emailVerifyExpires = undefined;
        return next(new ApiError('send verification Email is faild', 500, 'resend Verification Code controller'))
    };

    await user.save();
    return sendResponse(res, { message: 'Verification code resent successfully' });
});


// ------------------  Forget Password   ------------------

export const forgotPassword = catchError(async (req, res, next) => {
    const { email, mobileNumber } = req.body;
    const user = await User.findOne({
        $or: [
            { email },
            { mobileNumber },
        ]
    });

    // 1- Check if user exists and password is correct
    if (!user) {
        return next(new ApiError(`No account found with the provided email or mobile number. Please check your details and try again.`, 404));
    }

    // 2- Generate OTP && hashing OTP in db
    const resetCode = generateOTP();
    const hashResetCode = cryptoHashData(resetCode);

    user.passwordResetCode = hashResetCode;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    //  3- Send otp via email
    const isEmailSend = await sentOTP({
        to: user.email,
        subject: "Job Search App - Password Reset Code",
        otp: resetCode,
        userName: user.username,
        textmessage: 'Use the following code to reset your password. This code is valid for 10 minutes.',
    });

    if (isEmailSend.rejected.length) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        return next(new ApiError('send reset code is faild', 500, 'forgotPassword controller'))
    };

    // 4- save user in DB
    await user.save();
    return sendResponse(res, { message: "A reset code has been sent to your email. Please check your inbox and follow the instructions to reset your password." });
})

export const verifyPassResetCode = catchError(async (req, res, next) => {
    const { resetCode } = req.body;
    const hashResetCode = cryptoHashData(resetCode);
    // 1- get user  based on resetCode
    const user = await User.findOne({
        passwordResetCode: hashResetCode,
        passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ApiError(`Reset code invalid or expired`, 400));
    }

    // 2- Reset code valid
    user.passwordResetVerified = true;

    await user.save();
    return sendResponse(res);
})

export const resetPassword = catchError(async (req, res, next) => {
    const { email, newPassword } = req.body;

    // get user  based on resetCode
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ApiError(`There is not user in this email.`, 404));
    }

    if (!user.passwordResetVerified) {
        return next(new ApiError(`Reset code not verified.`, 400));
    }
    const hashPassword = bcryptHashData(newPassword);

    // Generate token for authenticated user
    const token = generateToken({ userId: user._id, role: user.role });

    user.password = hashPassword;
    user.passwordResetVerified = undefined;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.status = 'online';
    user.logOut = undefined;

    const loggedUser = await user.save();
    return sendResponse(res, { data: sanitizeUser(loggedUser), token });
})


// ------------------ User data modification   ------------------
export const updateAccount = catchError(async (req, res, next) => {
    let { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
        return next(new ApiError('User not found.', 404, 'updateAccount controller'));
    }

    // Update user details
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.recoveryEmail = recoveryEmail || user.recoveryEmail;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.username = `${user.firstName} ${user.lastName}`.trim();

    // Update user email
    if (email) {
        //  generate OTP
        const confirmationCode = generateOTP();
        user.emailVerifyCode = cryptoHashData(confirmationCode);
        user.emailVerifyExpires = new Date(Date.now() + 10 * 60 * 1000);
        user.isConfirmed = false;

        //  send confirmation email
        const isEmailSend = await sentOTP({
            to: email,
            subject: "Job Search App - Verify Your Email",
            otp: confirmationCode,
            userName: user.username,
            textmessage: 'Please use the following OTP to complete change email process. The OTP is valid for 10 minutes.',
        });

        if (isEmailSend.rejected.length) {
            user.emailVerifyCode = undefined;
            user.emailVerifyExpires = undefined;
            user.isConfirmed = true;
            return next(new ApiError('send verification Email is faild', 500, 'signUp controller'))
        };

        user.email = email;
    }

    // If the DOB field is provided, validate and convert it
    if (DOB) {
        const dobDateTime = DateTime.fromISO(DOB); // Convert DOB to a DateTime object and validate it
        if (!dobDateTime.isValid) {
            return next(new ApiError('Invalid date format for DOB. Please use YYYY-MM-DD.', 400, 'updateAccount controller'));
        }
        user.DOB = dobDateTime;
    }

    // Save the updated user
    const userUpdated = await user.save();
    return sendResponse(res, { data: sanitizeUser(userUpdated) });
});


export const updatePassword = catchError(async (req, res, next) => {
    const { password, newPassword } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);

    // 1- Check if user password is correct
    if (!bcryptCompare(password, user.password)) {
        return next(new ApiError('Incorrect password', 403));
    }

    // 2- hash new password
    const hashPassword = bcryptHashData(newPassword);

    // 3- send email to user
    const isEmailSend = await sendMails({
        to: user.email,
        subject: "Job Search App - change password",
        html: MsgHTML(user.username, 'Your password has been changed successfully.')
    });

    if (isEmailSend?.rejected.length) {
        return next(new ApiError('send change passwoed Email is faild', 500, 'updatePassword controller'))
    };

    // 4- save updated password
    user.password = hashPassword;
    user.passwordChangedAt = DateTime.now();

    await user.save();
    return sendResponse(res, { message: 'password changed successfully, please login again.' });
});

export const deleteAccount = catchError(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
        return next(new ApiError('user not found.', 404, 'deleteAccount controller'));
    }
    await user.deleteOne();
    return sendResponse(res);
});



// ------------------ GET user Data  ------------------

export const getLoggedUser = catchError(async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
        return next(new ApiError('User not found.', 404, 'getLoggedUser controller'));
    }
    return sendResponse(res, { data: sanitizeUser(user) });
});

export const getUserProfile = catchError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById({ _id: id });
    if (!user) {
        return next(new ApiError('User not found.', 404, 'getUser controller'));
    }
    return sendResponse(res, { data: sanitizeUserProfile(user) });
});

export const getUserListByRecoveryEmail = catchError(async (req, res, next) => {
    const { recoveryEmail } = req.body;
    const users = await User.find({ recoveryEmail });
    return sendResponse(res, { data: sanitizeUserProfile(users) });
});