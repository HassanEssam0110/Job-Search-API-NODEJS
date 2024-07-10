import { Router } from "express";
import { signIn, signUp, verifyEmail, updateAccount, logOut, deleteAccount, getLoggedUser, getUserProfile, updatePassword, getUserListByRecoveryEmail, resendEmailVerifyCode, forgotPassword, verifyPassResetCode, resetPassword, signUpCompany_HR } from "./user.controller.js";
import { checkUserExist } from "../../middlewares/check-exist.middleware.js";
import { auth } from './../../middlewares/auth.middleware.js';
import { validatorMiddleware } from './../../middlewares/validation.middleware.js';
import { forgotPasswordValidator, getAccountsByRecoveryEmailValidator, getUserProfilevalidator, resendEmailVerifyValidator, resetPasswordValidator, signinValidator, signupValidator, updateAccountValidator, updatePasswordValidator, verifyPassResetCodeValidator, virfiyEmailValidator } from "./user.validations.js";
import { athorization } from "../../middlewares/authorization.middleware.js";
import { systemRoles } from "../../utils/constants/system-roles.utils.js";

const { USER, COMPANY_HR } = systemRoles;
const userRouter = Router();

userRouter.post('/signup', validatorMiddleware(signupValidator), checkUserExist, signUp)
userRouter.post('/signup-company_HR', validatorMiddleware(signupValidator), checkUserExist, signUpCompany_HR, signUp)

userRouter.post('/signin', validatorMiddleware(signinValidator), signIn)

userRouter.put('/verify-email', validatorMiddleware(virfiyEmailValidator), verifyEmail)
userRouter.post('/resend-email-verify-code', validatorMiddleware(resendEmailVerifyValidator), resendEmailVerifyCode)

userRouter.post('/forgot-password', validatorMiddleware(forgotPasswordValidator), forgotPassword)
userRouter.post('/verify-reset-code', validatorMiddleware(verifyPassResetCodeValidator), verifyPassResetCode)
userRouter.post('/reset-password', validatorMiddleware(resetPasswordValidator), resetPassword)

userRouter.put('/update-account', auth, athorization([USER, COMPANY_HR]), validatorMiddleware(updateAccountValidator), checkUserExist, updateAccount)
userRouter.put('/update-password', auth, athorization([USER, COMPANY_HR]), validatorMiddleware(updatePasswordValidator), updatePassword)
userRouter.delete('/delete-account', auth, athorization([USER, COMPANY_HR]), deleteAccount)

userRouter.get('/get-me', auth, athorization([USER, COMPANY_HR]), getLoggedUser)
userRouter.get('/:id/profile', auth, athorization([USER, COMPANY_HR]), validatorMiddleware(getUserProfilevalidator), getUserProfile)
userRouter.get('/recovery-email', auth, athorization([USER, COMPANY_HR]), validatorMiddleware(getAccountsByRecoveryEmailValidator), getUserListByRecoveryEmail)

userRouter.patch('/logout', auth, logOut)


export default userRouter;