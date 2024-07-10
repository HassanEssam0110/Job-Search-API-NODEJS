import { Schema, model } from "mongoose";
import { jobLocations, seniorityLevels, workingTimes } from "../../src/utils/constants/job-constants.utils.js";
import { Application } from "./application.model.js";

const jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: [true, "jobTitle required"],
        trim: true
    },
    jobLocation: {
        type: String,
        required: [true, "jobLocation required"],
        enum: Object.values(jobLocations)
    },
    workingTime: {
        type: String,
        required: [true, "workingTime required"],
        enum: Object.values(workingTimes)
    },
    seniorityLevel: {
        type: String,
        required: [true, "seniorityLevel required"],
        enum: Object.values(seniorityLevels)
    },
    jobDescription: {
        type: String,
        required: [true, "jobDescription required"],
        trim: true
    },
    technicalSkills: {
        type: [String],
        required: [true, "technicalSkills required"],
    },
    softSkills: {
        type: [String],
        required: [true, "softSkills required"],
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


// Define the virtual field
jobSchema.virtual('company', {
    ref: 'Company', // Reference to Company model
    localField: 'addedBy',
    foreignField: 'companyHR',
    justOne: true, // Assuming each addedBy has one company
});


// Middleware to handle cascading deletes
jobSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        const jobId = this._id;
        await Application.deleteMany({ jobId })
        next();
    } catch (error) {
        console.error(`Error in pre hook: ${error.message}`);
        next(error);
    }
});


export const Job = model('Job', jobSchema);