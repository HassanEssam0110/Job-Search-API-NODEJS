import ExcelJS from 'exceljs';
import path from 'path'
import { v4 as uuidv4 } from 'uuid';

import { ApiError } from './api-error.utils.js';


/**
 * Generates an Excel sheet containing application data based on specified applications and a specific date.
 * @param {Array<Object>} applications - Array of application objects containing job and user data.
 * @param {string} specificDate - Specific date string to include in the file name.
 * @returns {Promise<string>} Promise resolving to the file path of the generated Excel sheet.
 * @throws {ApiError} Throws an error if generating the Excel sheet fails.
 */
export const generateExcelSheet = async (applications, specificDate) => {
    try {
        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Applications');

        // Define custom header style
        const headerStyle = {
            font: { bold: true },
            alignment: { vertical: 'middle', horizontal: 'center' },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'e8e8e8' } // Light gray background color (ARGB format)
            },
            height: '50px' // Header row height in points
        };

        // Define worksheet headers
        worksheet.columns = [
            { header: 'Job Title', key: 'jobTitle', width: 20 },
            { header: 'Job Location', key: 'jobLocation', width: 20 },
            { header: 'Working Time', key: 'workingTime', width: 20 },
            { header: 'Seniority Level', key: 'seniorityLevel', width: 20 },
            { header: 'Job Description', key: 'jobDescription', width: 20 },
            { header: 'Technical Skills', key: 'technicalSkills', width: 20 },
            { header: 'Soft Skills', key: 'softSkills', width: 20 },
            { header: 'User Name', key: 'username', width: 20 },
            { header: 'User Email', key: 'email', width: 25 },
            { header: 'User DOB', key: 'DOB', width: 20 },
            { header: 'User Mobile Number', key: 'mobileNumber', width: 25 },
            { header: 'User Tech Skills', key: 'userTechSkills', width: 20 },
            { header: 'User Soft Skills', key: 'userSoftSkills', width: 20 },
            { header: 'User Resume', key: 'userResume', width: 20 },
        ];

        // Apply custom header style to each cell in the header row
        worksheet.getRow(1).eachCell(cell => {
            cell.style = headerStyle;
        });

        // Add rows to the worksheet
        applications.forEach(application => {
            worksheet.addRow({
                jobTitle: application.jobId.jobTitle,
                jobLocation: application.jobId.jobLocation,
                workingTime: application.jobId.workingTime,
                seniorityLevel: application.jobId.seniorityLevel,
                jobDescription: application.jobId.jobDescription,
                technicalSkills: application.jobId.technicalSkills.join(' , '),
                softSkills: application.jobId.softSkills.join(' , '),
                username: application.userId.username,
                email: application.userId.email,
                DOB: application.userId.DOB,
                mobileNumber: application.userId.mobileNumber,
                userTechSkills: application.userTechSkills.join(' , '),
                userSoftSkills: application.userSoftSkills.join(' , '),
                userResume: application.userResume
            });
        });

        // Define the file path and name with a unique identifier
        const fileName = `applications_${specificDate}_${uuidv4()}.xlsx`;
        const filePath = path.join('uploads', 'applications', fileName);

        // Write the workbook to the file
        await workbook.xlsx.writeFile(filePath);
        return filePath;
    } catch (error) {
        throw new ApiError('Failed to generate Excel sheet');
    }
};