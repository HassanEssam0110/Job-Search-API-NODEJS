import { sendMails } from "../services/mail.service.js";
import { otpMsgHTML } from "./mail-html.utils.js";


/**
 * Generates a six-digit OTP (One Time Password).
 *
 * @returns {string} A six-digit OTP as a string.
 * 
 * @example
 * const otp = generateOTP();
 * console.log(otp); // Output: e.g., '123456'
 */
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}



/**
 * Sends an OTP via email.
 *
 * @async
 * @param {Object} options - The options for sending the OTP email.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.otp - The OTP to be sent.
 * @param {string} options.userName - The recipient's name.
 * @param {string} options.textmessage - Additional text message to include in the email.
 * @returns {Promise<Object>} A promise that resolves to the result of the email sending operation.
 * 
 * @example
 * const result = await sentOTP({
 *   to: 'user@example.com',
 *   subject: 'Your OTP Code',
 *   otp: '123456',
 *   userName: 'John Doe',
 *   textmessage: 'Use this OTP to verify your account.'
 * });
 * console.log(result); // Output: Result of the email sending operation
 */
export const sentOTP = async ({ to, subject, otp, userName, textmessage } = {}) => {
    return await sendMails({
        to,
        subject,
        html: otpMsgHTML(otp, userName, textmessage)
    });

}