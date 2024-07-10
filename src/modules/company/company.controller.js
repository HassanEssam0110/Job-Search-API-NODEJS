import { Company } from '../../../database/models/company.model.js';
import { Job } from '../../../database/models/job.model.js';
import { Application } from './../../../database/models/application.model.js';
import { catchError } from './../../middlewares/error/catch-error.middleware.js';
import { sendResponse } from '../../utils/send-response.utils.js';
import { ApiError } from '../../utils/api-error.utils.js';
import { createOne, deleteOne, updateOne } from '../../utils/handlers-factory.utils.js';
import { generateExcelSheet } from '../../utils/genrate-applications-sheet.utils.js';

export const addCompany = createOne(Company, 'companyHR');
export const updateCompany = updateOne();
export const deleteCompany = deleteOne();


// Get Specific company by id with jobs 
export const getCompanyByIdWithJobs = catchError(async (req, res, next) => {
    const { id } = req.params;
    const company = await Company.findById(id).populate([
        { path: 'companyHR', select: 'username email' },
        {
            path: 'jobs',
            select: 'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills',
        }]
    );
    if (!company) {
        return next(new ApiError('Company not found', 404, 'getCompanyByIdWithJobs constroller'));
    }
    return sendResponse(res, { data: company });
});

// Get company list and Search for a company name.  
export const getCompanyList = catchError(async (req, res, next) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query = { companyName: { $regex: search, $options: 'i' } };
    }
    const company = await Company.find(query);
    return sendResponse(res, { data: company });
});


//  Get all Applications by specific Jobs id
export const getAllApplicationsSpecificJob = catchError(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the job by ID
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.addedBy.toString() !== userId.toString()) return res.status(403).json({ message: 'you are not allowed to access this job' });

    const applications = await Application.find({ jobId: job._id })
        .populate({ path: 'userId', select: 'firstName lastName email DOB mobileNumber' })
        .populate({ path: 'jobId' })

    return sendResponse(res, { count: applications.length, data: applications });
});

// => Get all Applications Specific Date and send in Sheet (Bons)
export const getAllApplicationsSpecificDateSheet = catchError(async (req, res, next) => {
    const { companyId, specificDate } = req.body;
    const userId = req.user.id;

    const company = await Company.findById(companyId).populate([
        { path: 'companyHR', select: 'username email' },
        {
            path: 'jobs',
            select: 'jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills',
        }]
    );

    if (!company) {
        return next(new ApiError('Company not found', 404, 'getAllApplicationsSpecificDateSheet controller'))
    }

    if (company?.companyHR?._id.toString() !== userId.toString()) {
        return next(new ApiError('You are not allowed to perform this action.', 403, 'getAllApplicationsSpecificDateSheet controller'))
    }

    const jobsId = company.jobs.map(job => job._id);
    const applications = await Application
        .find({
            jobId:
                { $in: jobsId },
            createdAt: {
                $gte: new Date(specificDate), // Start of the specific date
                $lt: new Date(new Date(specificDate).setDate(new Date(specificDate).getDate() + 1)) // End of the specific date
            }
        })
        .populate([
            { path: 'userId', select: 'username email DOB mobileNumber' },
            { path: 'jobId' }])

    if (!applications.length) return next(new ApiError(`no applications found in this date ${specificDate}`, 404))
    const filePath = await generateExcelSheet(applications, specificDate);
    const fileUrl = `${process.env.BASE_URL}/${filePath.replace(/\\/g, '/')}`;

    sendResponse(res, { message: 'File created successfully', fileUrl });
});