import { catchError } from "../../middlewares/error/catch-error.middleware.js";
import { createOne, deleteOne, updateOne } from "../../utils/handlers-factory.utils.js";
import { sendResponse } from "../../utils/send-response.utils.js";
import { Job } from './../../../database/models/job.model.js';
import { Company } from './../../../database/models/company.model.js';
import { ApiError } from './../../utils/api-error.utils.js';
import { Application } from "../../../database/models/application.model.js";
import { uploadSingleFile } from './../../services/upload-file.service.js';
import { uploadSingleFileToCloudinary } from "../../utils/cloudinary.utils.js";
import { sanitizeJobsOnly } from "../../utils/sanitize-data.utils.js";

// use Middleware multer to uplaod single pdf file.
export const uploadResume = uploadSingleFile('userResume', 'resumes');

export const addJob = createOne(Job, 'addedBy');
export const updateJob = updateOne();
export const deleteJob = deleteOne();

// Retrieves a list with their company’s information.
export const getJobsWithCompanyInfo = catchError(async (req, res, next) => {
    const jobsWithCompanyInfo = await Job.find().populate([
        {
            path: 'addedBy',
            select: 'username email',
        },
        {
            path: 'company', // Populate the virtual field
            select: 'companyName description industry address numberOfEmployees companyEmail', // Fields from the Company model
        }
    ]);

    return sendResponse(res, { count: jobsWithCompanyInfo.length, data: jobsWithCompanyInfo });
});

// Retrieves a list of jobs based on Company Name.
export const getJobsBySpecificCompanyName = catchError(async (req, res, next) => {
    const { companyName } = req.query;
    const company = await Company.findOne({ companyName })
        .populate([
            { path: 'companyHR', select: 'username email' },
            {
                path: 'jobs',
                select: 'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills',
            }]
        );;
    if (!company) return next(new ApiError('Company not found.', 404, "GetJobsBySpecificCompany contriller"));
    return sendResponse(res, { count: sanitizeJobsOnly(company).jobs.length, data: sanitizeJobsOnly(company).jobs });
});

// Retrieves a list of jobs based on query parameters (filters).
export const getJobsList = catchError(async (req, res, next) => {
    let { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
    // Construct the query object based on provided query parameters
    const jobs = await Job.find({
        $or: [
            { workingTime },
            { jobLocation },
            { seniorityLevel },
            { jobTitle: { $regex: jobTitle || '', $options: 'i' } },
            { technicalSkills: { $in: technicalSkills?.split(',') } }
        ]
    });
    return sendResponse(res, { count: jobs.length, data: jobs });
});

// Apply to Job
export const ApplyToJob = catchError(async (req, res, next) => {
    let { userTechSkills, userSoftSkills } = req.body;

    const userId = req.user._id;
    const { id } = req.params; // job id
    const userResumePath = req.file.path;

    const job = await Job.findById(id); // to check if job exists.
    if (!job) return next(new ApiError('Job not found', 404, 'apply to job controller'));


    // upload to colud. 
    const result = await uploadSingleFileToCloudinary(userResumePath, 'resumes');
    if (!result) return next(new ApiError('Failed to upload file to Cloudinary', 400, 'apply to job controller'));

    const application = await Application.create({
        jobId: job._id,
        userId,
        userTechSkills: userTechSkills.split(','),
        userSoftSkills: userSoftSkills.split(','),
        userResume: result.secure_url,
    });

    return sendResponse(res, { data: application }, 201);
});