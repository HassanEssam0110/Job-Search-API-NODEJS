export const sanitizeUser = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        isConfirmed: user.isConfirmed,
        recoveryEmail: user.recoveryEmail,
        DOB: user.DOB,
        mobileNumber: user.mobileNumber,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }
}

export const sanitizeUserProfile = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        DOB: user.DOB,
        status: user.status,
        role: user.role,
        createdAt: user.createdAt,
    }
}

export const sanitizeJobWithCompany = (job, company) => {
    return {
        jobTitle: job.jobTitle,
        jobLocation: job.jobLocation,
        workingTime: job.workingTime,
        seniorityLevel: job.seniorityLevel,
        jobDescription: job.jobDescription,
        technicalSkills: job.technicalSkills,
        softSkills: job.softSkills,
        company: {
            companyName: company.companyName,
            description: company.description,
            industry: company.industry,
            address: company.address,
            numberOfEmployees: company.numberOfEmployees,
            companyEmail: company.companyEmail
        },
        addedBy: job.addedBy,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt
    };
}

export const sanitizeJobsOnly = (company) => {
    return {
        jobs: company.jobs,
    };
}