import { Router } from "express";

import { auth } from "../../middlewares/auth.middleware.js";
import { checkCompanyExist } from "../../middlewares/check-exist.middleware.js";
import { addCompany, deleteCompany, getAllApplicationsSpecificDateSheet, getAllApplicationsSpecificJob, getCompanyByIdWithJobs, getCompanyList, updateCompany } from "./company.controller.js";
import { athorization } from "../../middlewares/authorization.middleware.js";
import { systemRoles } from "../../utils/constants/system-roles.utils.js";
import { checkOwnerMiddleware } from "../../middlewares/check-owner.middleware.js";
import { Company } from "../../../database/models/company.model.js";
import { validatorMiddleware } from './../../middlewares/validation.middleware.js';
import { addCompanyValidator, deleteCompanyValidator, getAllApplicationsSheetValidator, getCompanyByIdValidator, getCompanyListValidator, updateCompanyValidator } from "./company.validations.js";

const { USER, COMPANY_HR } = systemRoles;
const companyRouter = Router();

companyRouter.route('/')
    .get(auth, athorization([USER, COMPANY_HR]), validatorMiddleware(getCompanyListValidator), getCompanyList)
    .post(auth, athorization([COMPANY_HR]), validatorMiddleware(addCompanyValidator), checkCompanyExist, addCompany)

companyRouter.route('/:id')
    .get(auth, athorization([COMPANY_HR]), validatorMiddleware(getCompanyByIdValidator), getCompanyByIdWithJobs)
    .put(auth, athorization([COMPANY_HR]), checkOwnerMiddleware(Company, 'companyHR'), validatorMiddleware(updateCompanyValidator), checkCompanyExist, updateCompany)
    .delete(auth, athorization([COMPANY_HR]), checkOwnerMiddleware(Company, 'companyHR'), validatorMiddleware(deleteCompanyValidator), deleteCompany)


companyRouter.get('/applications/sheet', auth, athorization([COMPANY_HR]), validatorMiddleware(getAllApplicationsSheetValidator), getAllApplicationsSpecificDateSheet)
companyRouter.get('/job-applications/:id', auth, athorization([COMPANY_HR]), validatorMiddleware(getCompanyByIdValidator), getAllApplicationsSpecificJob)

export default companyRouter;

