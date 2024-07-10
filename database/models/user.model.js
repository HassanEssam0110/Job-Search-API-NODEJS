import { model, Schema } from "mongoose";

import { systemRoles } from "../../src/utils/constants/system-roles.utils.js";
import { userStatus } from "../../src/utils/constants/user-status.js";
import { Application } from './application.model.js';
import { Job } from './job.model.js';
import { Company } from "./company.model.js";


const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last Name required"],
        trim: true,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: [true, "email is already taken. Please provide a unique email address."],
        trim: true,
    },
    emailVerifyCode: String,
    emailVerifyExpires: Date,
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Password required"],
        minlength: [8, "Too short password"]
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    recoveryEmail: {
        type: String,
        unique: false,
        trim: true,
    },
    DOB: {
        type: Date,
        required: [true, "date of birth required"],
    },
    mobileNumber: {
        type: String,
        unique: [true, "This mobile number is already taken. Please provide a unique mobile number."],
        required: [true, "mobile number required"],
        trim: true,
    },
    role: {
        type: String,
        enum: Object.values(systemRoles),
        default: systemRoles.USER
    },
    status: {
        type: String,
        enum: Object.values(userStatus),
        default: userStatus.OFFLINE
    },
    logOut: String,
}, {
    timestamps: true,
    versionKey: false
});


// Middleware to handle cascading deletes
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const userId = this._id;
        const userRole = this.role;
        if (userRole === systemRoles.COMPANY_HR) {
            await Company.deleteMany({ companyHR: userId })
            await Job.deleteMany({ addedBy: userId })
        }
        else {
            await Application.deleteMany({ userId })
        }
        next();
    } catch (error) {
        console.error(`Error in pre hook: ${error.message}`);
        next(error);
    }
});


export const User = model('User', userSchema);