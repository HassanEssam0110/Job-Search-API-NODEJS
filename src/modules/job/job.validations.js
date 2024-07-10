import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";


export const addJobValidator = {
    body: Joi.object({
        jobTitle: generalRules.jobTitle.required(),
        jobLocation: generalRules.jobLocation.required(),
        workingTime: generalRules.workingTime.required(),
        seniorityLevel: generalRules.seniorityLevel.required(),
        jobDescription: generalRules.jobDescription.required(),
        technicalSkills: generalRules.technicalSkills.required(),
        softSkills: generalRules.softSkills.required(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const updateJobValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    body: Joi.object({
        jobTitle: generalRules.jobTitle.optional(),
        jobLocation: generalRules.jobLocation.optional(),
        workingTime: generalRules.workingTime.optional(),
        seniorityLevel: generalRules.seniorityLevel.optional(),
        jobDescription: generalRules.jobDescription.optional(),
        technicalSkills: generalRules.technicalSkills.optional(),
        softSkills: generalRules.softSkills.optional(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}


export const deleteJobValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}


export const getJobsWithCompanyInfoValidator = {
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    }),
}

export const JobsByCompanyNameValidator = {
    query: Joi.object({
        companyName: Joi.string().required().messages({
            'string.base': 'Company name must be a string',
            'string.empty': 'Company name is required',
            'any.required': 'Company name is required',
        }),
    })
    ,
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    }),
}

export const getJobListValidator = {

    query: Joi.object({
        workingTime: Joi.string().max(200).optional().messages({
            'string.base': 'Working time must be a string',
            'string.max': 'Working time must not exceed 200 characters'
        }),
        jobLocation: Joi.string().max(200).optional().messages({
            'string.base': 'Job location must be a string',
            'string.max': 'Job location must not exceed 200 characters'
        }),
        seniorityLevel: Joi.string().max(200).optional().messages({
            'string.base': 'Seniority level must be a string',
            'string.max': 'Seniority level must not exceed 200 characters'
        }),
        jobTitle: Joi.string().max(200).optional().messages({
            'string.base': 'Job title must be a string',
            'string.max': 'Job title must not exceed 200 characters'
        }),
        technicalSkills: Joi.string().max(200).optional().messages({
            'string.base': 'Technical skills must be a string',
            'string.max': 'Technical skills must not exceed 200 characters'
        }),
    })
    ,
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    }),
}

export const applyApplicationvalidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    body: Joi.object({
        userTechSkills: Joi.string().required().messages({
            'string.base': 'User technical skills must be a string',
            'string.empty': 'User technical skills are required',
            'any.required': 'User technical skills are required'
        }),
        userSoftSkills: Joi.string().required().messages({
            'string.base': 'User soft skills must be a string',
            'string.empty': 'User soft skills are required',
            'any.required': 'User soft skills are required'
        }),
    }),
    file: Joi.object().required().messages({
        'any.required': 'Resume is required'
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    }),
}