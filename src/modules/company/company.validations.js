import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";


export const addCompanyValidator = {
    body: Joi.object({
        companyName: generalRules.companyName.required(),
        companyEmail: generalRules.companyEmail.required(),
        description: generalRules.description.required(),
        industry: generalRules.industry.required(),
        address: generalRules.address.required(),
        numberOfEmployees: generalRules.numberOfEmployees.required(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const updateCompanyValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    body: Joi.object({
        companyName: generalRules.companyName.optional(),
        companyEmail: generalRules.companyEmail.optional(),
        description: generalRules.description.optional(),
        industry: generalRules.industry.optional(),
        address: generalRules.address.optional(),
        numberOfEmployees: generalRules.numberOfEmployees.optional(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const deleteCompanyValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    })
}

export const getCompanyByIdValidator = {
    params: Joi.object({
        id: generalRules.objectId.required()
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    }),
}

export const getCompanyListValidator = {
    query: Joi.object({
        search: Joi.string().max(200).allow('').optional().messages({
            'string.base': 'Search must be a type of text.',
            'string.empty': 'Search should not be empty.',
            'string.max': 'Search must have a maximum length of {#limit}.'
        })
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    }),
}

export const getAllApplicationsSheetValidator = {
    body: Joi.object({
        companyId: generalRules.objectId.required(),
        specificDate: generalRules.date.required(),
    }),
    headers: Joi.object({
        authorization: Joi.string().required(),
        ...generalRules.headers,
    }),

}