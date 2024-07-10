import { Router } from "express";

import { getJobsBySpecificCompanyName, addJob, deleteJob, getJobsWithCompanyInfo, updateJob, getJobsList, ApplyToJob, uploadResume } from "./job.controllers.js";
import { auth } from './../../middlewares/auth.middleware.js';
import { athorization } from './../../middlewares/authorization.middleware.js';
import { systemRoles } from "../../utils/constants/system-roles.utils.js";
import { checkOwnerMiddleware } from "../../middlewares/check-owner.middleware.js";
import { Job } from "../../../database/models/job.model.js";
import { validatorMiddleware } from './../../middlewares/validation.middleware.js';
import { JobsByCompanyNameValidator, addJobValidator, applyApplicationvalidator, deleteJobValidator, getJobListValidator, getJobsWithCompanyInfoValidator, updateJobValidator } from "./job.validations.js";


const { USER, COMPANY_HR } = systemRoles;
const jobRouter = Router();

jobRouter.route('/')
    .get(auth, athorization([USER, COMPANY_HR]), validatorMiddleware(getJobListValidator), getJobsList)
    .post(auth, athorization([COMPANY_HR]), validatorMiddleware(addJobValidator), addJob)

jobRouter.route('/:id')
    .put(auth, athorization([COMPANY_HR]), checkOwnerMiddleware(Job, 'addedBy'), validatorMiddleware(updateJobValidator), updateJob)
    .delete(auth, athorization([COMPANY_HR]), checkOwnerMiddleware(Job, 'addedBy'), validatorMiddleware(deleteJobValidator), deleteJob)

jobRouter.get('/jobs-by-comapny-name', auth, athorization([USER, COMPANY_HR]), validatorMiddleware(JobsByCompanyNameValidator), getJobsBySpecificCompanyName)
jobRouter.get('/jobs-with-comapny-info', auth, athorization([USER, COMPANY_HR]), validatorMiddleware(getJobsWithCompanyInfoValidator), getJobsWithCompanyInfo)

jobRouter.post('/:id/apply', auth, athorization([USER]), uploadResume, validatorMiddleware(applyApplicationvalidator), ApplyToJob);


export default jobRouter;