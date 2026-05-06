const upload = require("../middleware/file.middleware");
const pdfParser = require("pdf-parse");
const {generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description
 */

async function generateInterViewReportController(req,res){

    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("req.headers:", req.headers);


    const resumeContent = await (new pdfParser.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    // const resumeContent = await pdfParser(req.file.buffer);
    const { selfDescription , jobDescription } = req.body;

    const interviewReportByAI = await generateInterviewReport(resumeContent.text,selfDescription,jobDescription);

    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAI
    });
    
    res.status(201).json({
        message:"Interview Report generate successfuly",
        interviewReport
    });
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function generateInterViewReportByIdController(req,res){
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({
        _id:interviewId,
        user:req.user.id
    });

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found."
        });
    }

    return res.status(200).json({
        message:"Interview report fetched successfully.",
        interviewReport
    });

}

/**
 * @description Controller to get all interview reports of the logged in user
 */
async function getAllInterviewReport(req,res){
    const interviewReports = await interviewReportModel.find({
        user:req.user.id
    }).sort({
        createdAt:-1
    }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

    return res.status(200).json({
        message:"Interview report fetched successfully.",
        interviewReports 
    });
}





module.exports =  { generateInterViewReportController,
generateInterViewReportByIdController,
getAllInterviewReport
 }