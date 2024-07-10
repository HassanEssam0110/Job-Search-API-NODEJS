import { model } from "mongoose";
import { Schema } from "mongoose";

const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, "jobId required"],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "userId required"],
    },
    userTechSkills: {
        type: [String],
        required: [true, "userTechSkills required"],
    },
    userSoftSkills: {
        type: [String],
        required: [true, "userSoftSkills required"],
    },
    userResume: {
        type: Object,
        required: [true, "userResume required"],
    },
}, {
    timestamps: true,
    versionKey: false
})



export const Application = model('Application', applicationSchema);