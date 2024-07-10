import { ApiError } from "../utils/api-error.utils.js";
import { catchError } from "./error/catch-error.middleware.js";


/**
 * Middleware function to check if the current user owns the document based on the ownerField.
 * @param {import('../../database/models').Model} Model - Mongoose model to query.
 * @param {string} ownerField - Field in the document representing the owner's ID.
 * @returns {import('express').RequestHandler} Express middleware function.
 */
export const checkOwnerMiddleware = (Model, ownerField) => {
    return catchError(async (req, res, next) => {
        const docFounded = await Model.findById(req.params.id);

        if (!docFounded) return next(new ApiError('Oops,not found!', 404, 'check Owner Middleware'));

        if (docFounded[ownerField].toString() !== req.user._id.toString()) {
            return next(new ApiError(`You are not allowed to perform this action.`, 403, 'check Owner Middleware'));
        }

        req.docFounded = docFounded;
        next();
    })
}
