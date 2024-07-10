import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";
import { systemRoles } from "../../utils/constants/system-roles.utils.js";


// ------------------  Auth  ------------------
export const signupValidator = {
    body: Joi.object({
        firstName: generalRules.firstName.required(),
        lastName: generalRules.lastName.required(),
        email: generalRules.email.required(),
        mobileNumber: generalRules.phoneNumber.required(),
        password: generalRules.password,
        cPassword: Joi.string()
            .trim(true)
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'string.base': 'Confirm password should be a type of text',
                'string.empty': 'Confirm password is required',
                'any.only': 'Confirm password does not match password',
                'any.required': 'Confirm password is a required field'
            }),
        DOB: generalRules.date.required(),
        role: Joi.string().valid(systemRoles.COMPANY_HR).optional(),
    }),
    headers: Joi.object({ ...generalRules.headers, })
}

export const signinValidator = {
    body: Joi.object({
        email: generalRules.email.optional(),
        mobileNumber: generalRules.phoneNumber.optional(),
        password: generalRules.password,
    }),
    headers: Joi.object({ ...generalRules.headers, })
}

// ------------------  Email Confirmation   ------------------

export const virfiyEmailValidator = {
    body: Joi.object({
        verifyCode: generalRules.verifyCode,
    }),
    headers: Joi.object({
        ...generalRules.headers,
    })
}

export const resendEmailVerifyValidator = {
    body: Joi.object({
        email: generalRules.email.required(),
    }),
    headers: Joi.object({ ...generalRules.headers, })
}


// ------------------  Forget Password   ------------------
export const forgotPasswordValidator = {
    body: Joi.object({
        email: generalRules.email.optional(),
        mobileNumber: generalRules.phoneNumber.optional(),
    }),
    headers: Joi.object({
        ...generalRules.headers,
    })
}

export const verifyPassResetCodeValidator = {
    body: Joi.object({
        resetCode: generalRules.verifyCode,
    }),
    headers: Joi.object({ ...generalRules.headers, })
}

export const resetPasswordValidator = {
    body: Joi.object({
        email: generalRules.email.required(),
        newPassword: generalRules.password.required(),
        cPassword: Joi.string()
            .trim(true)
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'string.base': 'Confirm password should be a type of text',
                'string.empty': 'Confirm password is required',
                'any.only': 'Confirm password does not match password',
                'any.required': 'Confirm password is a required field'
            }),
    }),
    headers: Joi.object({ ...generalRules.headers, })
}

// ------------------  user Data   ------------------

export const getUserProfilevalidator = {
    params: Joi.object({
        id: generalRules.objectId.required(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const updatePasswordValidator = {
    body: Joi.object({
        password: generalRules.password,
        newPassword: generalRules.newPassword,
        cPassword: Joi.string()
            .trim(true)
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'string.base': 'Confirm password should be a type of text',
                'string.empty': 'Confirm password is required',
                'any.only': 'Confirm password does not match password',
                'any.required': 'Confirm password is a required field'
            }),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const updateAccountValidator = {
    body: Joi.object({
        firstName: generalRules.firstName.optional(),
        lastName: generalRules.lastName.optional(),
        mobileNumber: generalRules.phoneNumber.optional(),
        email: generalRules.email.optional(),
        DOB: generalRules.date.optional(),
        recoveryEmail: generalRules.email.optional(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const getAccountsByRecoveryEmailValidator = {
    body: Joi.object({
        recoveryEmail: generalRules.email.required(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
} 