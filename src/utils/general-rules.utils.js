import Joi from "joi";
import { DateTime } from "luxon";
import { Types } from "mongoose";

import { jobLocations, seniorityLevels, workingTimes } from "./constants/job-constants.utils.js";


const objectIdRule = (value, helpers) => {
    const isObjectIdValid = Types.ObjectId.isValid(value)
    return isObjectIdValid ? value : helpers.message('Invalid Object Id')
}

const DateRule = (value, helpers) => {
    const inputDate = DateTime.fromISO(value);
    if (!inputDate.isValid) {
        return helpers.message('Invalid date format for DOB. Please use YYYY-MM-DD.');
    }
    // Return the validated date if valid
    return inputDate;
}

const nameRule = (value, helpers) => {
    const regex = /^(?!.*(?:admin|test)).*$/i;
    const forbidden = !regex.test(value)
    return forbidden ? helpers.message(`Please choose a different name. cannot use 'admin' or 'test' in your name.`) : value;
}

export const generalRules = {
    // ==> general 
    objectId: Joi.string().trim(true).custom(objectIdRule),

    phoneNumber: Joi.string()
        .pattern(/^(\+)?201[0125][0-9]{8}$/)
        .messages({
            'string.pattern.base': 'Invalid phone number format for Egypt.',
            'any.required': 'Mobile number is required.',
        }),

    verifyCode: Joi.string()
        .trim(true)
        .length(6)
        .required()
        .messages({
            'string.base': 'Verify code should be a type of text',
            'string.empty': 'Verify code is required',
            'string.length': 'Verify code must be exactly 6 characters long',
            'any.required': 'Verify code is a required field'
        }),


    date: Joi.date()
        .iso()
        .messages({
            'date.base': 'Date must be a valid ISO date format.',
            'date.format': 'Date must be in ISO format (YYYY-MM-DD).',
            'any.required': 'Date is required.',
        }),

    // ==> headers
    headers: {
        "content-type": Joi.alternatives().try(
            Joi.string().valid("application/json"),
            Joi.string().regex(/^multipart\/form-data(; boundary=.*)?$/i)
        ).optional().messages({
            'alternatives.match': 'Content-Type must be either "application/json" or "multipart/form-data"',
        }),
        // "content-type": Joi.string().valid("application/json").optional(),
        "user-agent": Joi.string().optional(),
        host: Joi.string().optional(),
        // "conctent-length": Joi.number().optional(),
        "content-length": Joi.number().optional(),
        "accept-encoding": Joi.string().optional(),
        accept: Joi.string().optional(),
        connection: Joi.string().optional(),
        "postman-token": Joi.string().optional(),
    },

    // ==> AUth rules
    firstName: Joi.string()
        .trim(true)
        .min(2)
        .max(50)
        .custom(nameRule)
        .messages({
            'string.base': 'firstName should be a type of text',
            'string.empty': 'firstNameis required',
            'string.min': 'firstName should have at least 2 characters',
            'string.max': 'firstName should have at most 50 characters',
            'any.required': 'firstName  is a required field'
        }),

    lastName: Joi.string()
        .trim(true)
        .min(2)
        .max(50)
        .custom(nameRule)
        .messages({
            'string.base': 'lastName should be a type of text',
            'string.empty': 'lastName is required',
            'string.min': 'lastName should have at least 2 characters',
            'string.max': 'lastName should have at most 50 characters',
            'any.required': 'lastName is a required field'
        }),

    email: Joi.string()
        .trim(true)
        .email()
        .messages({
            'string.base': 'Email should be a type of text',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is a required field'
        }),

    password: Joi.string()
        .trim(true)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .invalid('P@ssw0rd', 'Password1!')
        .required()
        .messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character (e.g., P@ssw0rd, Password1!)',
            'any.invalid': 'Password cannot be P@ssw0rd or Password1!',
            'any.required': 'Password is a required field'
        }),

    newPassword: Joi.string()
        .trim(true)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .invalid('P@ssw0rd', 'Password1!')
        .required()
        .messages({
            'string.base': 'Password should be a type of text',
            'string.empty': 'Password is required',
            'string.pattern.base': 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character (e.g., P@ssw0rd, Password1!)',
            'any.invalid': 'Password cannot be P@ssw0rd or Password1!',
            'any.required': 'Password is a required field'
        }),


    // ==> Company rules
    companyName: Joi.string().trim(true).min(3).max(200).messages({
        'string.base': 'Company name should be a type of text.',
        'string.empty': 'Company name is required.',
        'string.min': 'Company name should have a minimum length of {#limit}.',
        'string.max': 'Company name should have a maximum length of {#limit}.',
        'any.required': 'Company name is a required field.'
    }),
    description: Joi.string().trim(true).min(10).max(500).messages({
        'string.base': 'Description should be a type of text.',
        'string.empty': 'Description is required.',
        'string.min': 'Company description should have a minimum length of {#limit}.',
        'string.max': 'Company description should have a maximum length of {#limit}.',
        'any.required': 'Description is a required field.'
    }),
    companyEmail: Joi.string().trim(true).email().messages({
        'string.base': 'Company email should be a type of text.',
        'string.email': 'Company email must be a valid email.',
        'string.empty': 'Company email is required.',
        'any.required': 'Company email is a required field.'
    }),

    industry: Joi.string().trim(true).min(2).max(100).messages({
        'string.base': 'Industry should be a type of text.',
        'string.empty': 'Industry is required, like "Mental Health Care".',
        'string.min': 'Industry should have a minimum length of {#limit}.',
        'string.max': 'Industry should have a maximum length of {#limit}.',
        'any.required': 'Industry is a required field, like "Mental Health Care".'
    }),
    address: Joi.string().trim(true).min(5).max(200).messages({
        'string.base': 'Address should be a type of text.',
        'string.empty': 'Address is required.',
        'string.min': 'Address should have a minimum length of {#limit}.',
        'string.max': 'Address should have a maximum length of {#limit}.',
        'any.required': 'Address is a required field.'
    }),
    numberOfEmployees: Joi.string().trim(true)
        .valid('1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+')
        .required()
        .messages({
            'string.base': 'Number of employees should be a type of text.',
            'string.empty': 'Number of employees is required.',
            'any.only': 'Number of employees must be one of the following values: {#valids}.',
            'any.required': "Number of employees is required, like ''1-10', '11-20', '21-50'."
        }),

    // ==> Job rules
    jobTitle: Joi.string().trim(true).min(3).max(200).messages({
        'string.base': 'Job title should be a type of text.',
        'string.empty': 'Job title is required.',
        'string.min': 'Job title should have a minimum length of {#limit}.',
        'string.max': 'Job title should have a maximum length of {#limit}.',
        'any.required': 'Job title is a required field.'
    }),
    jobLocation: Joi.string().trim(true)
        .valid(...Object.values(jobLocations))
        .messages({
            'string.base': 'Job location should be a type of text.',
            'string.empty': 'Job location is required.',
            'any.only': 'Job location must be one of the following values: {#valids}.',
            'any.required': "Job location is required, like 'onsite'."
        }),
    workingTime: Joi.string().trim(true)
        .valid(...Object.values(workingTimes))
        .messages({
            'string.base': 'Working time should be a type of text.',
            'string.empty': 'Working time is required.',
            'any.only': 'Working time must be one of the following values: {#valids}.',
            'any.required': "Working time is required, like 'part-time'."
        }),
    seniorityLevel: Joi.string().trim(true)
        .valid(...Object.values(seniorityLevels))
        .messages({
            'string.base': 'seniorityLevel should be a type of text.',
            'string.empty': 'seniorityLevel is required.',
            'any.only': 'seniorityLevel must be one of the following values: {#valids}.',
            'any.required': "seniorityLevel is required, like 'Junior'."
        }),
    jobDescription: Joi.string().trim(true).min(10).max(500).messages({
        'string.base': 'Job description should be a type of text.',
        'string.empty': 'Job description is required.',
        'string.min': 'Job description should have a minimum length of {#limit}.',
        'string.max': 'Job description should have a maximum length of {#limit}.',
        'any.required': 'Job description is a required field.'
    }),
    technicalSkills: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Technical skills should be an array.',
        'array.empty': 'Technical skills cannot be empty.',
        'any.required': 'Technical skills are required.',
        'string.base': 'Each technical skill should be a string.'
    }),
    softSkills: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Soft skills should be an array.',
        'array.empty': 'Soft skills cannot be empty.',
        'any.required': 'Soft skills are required.',
        'string.base': 'Each soft skill should be a string.'
    }),


    // authorName: Joi.string()
    //     .trim(true)
    //     .min(2)
    //     .max(50)
    //     .messages({
    //         'string.base': 'Name should be a type of text',
    //         'string.empty': 'Name is required',
    //         'string.min': 'Name should have at least 2 characters',
    //         'string.max': 'Name should have at most 50 characters',
    //         'any.required': 'Name is a required field'
    //     }),
    // authorBio: Joi.string()
    //     .trim(true)
    //     .min(6)
    //     .max(200)
    //     .optional()
    //     .messages({
    //         'string.base': 'Bio should be a type of text',
    //         'string.min': 'Bio should have at least 6 characters',
    //         'string.max': 'Bio should have at most 200 characters'
    //     }),
    // authorBirthDate: Joi.date().iso().custom(DateRule).messages({
    //     'date.base': 'BirthDate should be a valid date format (YYYY-MM-DD)',
    //     'date.format': 'BirthDate should be in ISO format (YYYY-MM-DD)',
    //     'any.custom': 'BirthDate should be in ISO format (YYYY-MM-DD)',
    // }),
}