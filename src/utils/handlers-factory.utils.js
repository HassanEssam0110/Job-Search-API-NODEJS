import { catchError } from "../middlewares/error/catch-error.middleware.js";
import { sendResponse } from "./send-response.utils.js";


/**
 * Middleware function to update a document.
 * @returns {import('express').RequestHandler} Express middleware function.
 */
export const updateOne = () => catchError(async (req, res, next) => {
    const docFounded = req.docFounded;
    req.body.updatedAt = new Date();
    Object.assign(docFounded, req.body);
    const documentUpdated = await docFounded.save();
    return sendResponse(res, { data: documentUpdated });
});

/**
 * Middleware function to delete a document.
 * @returns {import('express').RequestHandler} Express middleware function.
 */
export const deleteOne = () => catchError(async (req, res, next) => {
    const docFounded = req.docFounded;
    await docFounded.deleteOne();
    return sendResponse(res);
});

/**
 * Middleware function to create a new document.
 * @param {import('../../database/models').Model} Model - Mongoose model to create the document.
 * @param {string} ownerField - Field in the document representing the owner's ID.
 * @returns {import('express').RequestHandler} Express middleware function.
 */
export const createOne = (Model, ownerField) => catchError(async (req, res, next) => {
    req.body[ownerField] = req.user._id;
    const newDocument = await Model.create(req.body);
    return sendResponse(res, { data: newDocument }, 201);
});