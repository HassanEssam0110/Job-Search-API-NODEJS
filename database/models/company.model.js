
import { Schema, model } from "mongoose";
import { Job } from "./job.model.js";


const companySchema = new Schema({
    companyName: {
        type: String,
        required: [true, "company name required"],
        unique: [true, "company name is already taken. Please provide a unique Company Name."],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "description required, Like 'what are the actual activities and services provided by the company ?'"],
        trim: true,
    },
    industry: {
        type: String,
        required: [true, "industry required, Like 'Mental Health care'"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "address required"],
        trim: true,
    },
    numberOfEmployees: {
        type: String,
        required: [true, "numberOfEmployees required, Like '51-100'"],
        enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+'],
    },
    companyEmail: {
        type: String,
        required: [true, "email required"],
        unique: [true, "email is already taken. Please provide a unique email address."],
        trim: true,
    },
    companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "companyHR required"],
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Define the virtual field
companySchema.virtual('jobs', {
    ref: 'Job', // Reference to Company model
    localField: 'companyHR',
    foreignField: 'addedBy',
    justOne: false, // Assuming each addedBy has one company
});


// Middleware to handle cascading deletes
companySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const companyHRId = this.companyHR;
        await Job.deleteMany({ addedBy: companyHRId })
        next();
    } catch (error) {
        console.error(`Error in pre hook: ${error.message}`);
        next(error); 
    }
});

export const Company = model('Company', companySchema);