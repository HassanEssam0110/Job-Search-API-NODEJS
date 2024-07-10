import jwt from 'jsonwebtoken';
import { ApiError } from './api-error.utils.js';


/**
 * Generates a JSON Web Token (JWT).
 *
 * @param {Object} [payload={}] - The payload to encode in the JWT.
 * @param {string} [secretKey=process.env.JWT_SECRET_KEY] - The secret key to sign the JWT.
 * @param {string} [expiresIn=process.env.JWT_EXPIRE_TIME] - The expiration time for the JWT.
 * @returns {string} The generated JWT.
 * @throws {ApiError} If the secret key is missing or an error occurs during token generation.
 * 
 * @example
 * const token = generateToken({ userId: '12345' });
 * console.log(token); // Output: Generated JWT
 */
export const generateToken = (payload = {}, secretKey = process.env.JWT_SECRET_KEY, expiresIn = process.env.JWT_EXPIRE_TIME) => {
    try {
        if (!secretKey) {
            throw new ApiError('JWT secret key is missing.', 500);
        }
        return jwt.sign(payload, secretKey, { expiresIn });
    } catch (error) {
        throw new ApiError(`Error generating token: ${error.message}`, 500);
    }
}


/**
 * Verifies a JSON Web Token (JWT).
 *
 * @param {string} token - The JWT to verify.
 * @param {string} [secretKey=process.env.JWT_SECRET_KEY] - The secret key to verify the JWT.
 * @returns {Object} The decoded payload if the token is valid.
 * @throws {Error} If the token is invalid or verification fails.
 * 
 * @example
 * const decoded = verifyToken(token);
 * console.log(decoded); // Output: Decoded payload
 */
export const verifyToken = (token, secretKey = process.env.JWT_SECRET_KEY) => {
    return jwt.verify(token, secretKey);
}