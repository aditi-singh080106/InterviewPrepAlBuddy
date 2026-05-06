const mongoose = require('mongoose');

/**
 * @user (input)
 * - Job Description Schema
 * - Resume Text
 * - Self Description
 * 
 * - MatchScore : Number
 * @ai
 * - Technical questions : [{
 *      question:"",
 *      intention:"",
 *      answere:"",
 * }]
 * - Behavioral question : [{
 *      question:"",
 *      intention:"",
 *      answere:"",
 * }]
 * - Skill gaps : [{
 *      skill:"",
 *      serverity:{
 *          type : String
 *          enum : ['low', 'medium', 'high']
 *      }
 * }]
 * - Prepration plan : [{
 *      day : Number , 
 *      focus : String ,
 *      task : [String]
 *   }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention:{
        type:String,
        required:true
    },
    answere: {
        type: String,
        required: true
    }
},
{
    _id:false
});

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention:{
        type:String,
        required:true
    },
    answere: {
        type: String,
        required: true
    }
},
{
    _id:false
});

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    serverity: {
        type:String,
        enum:['low','medium','high'],
        required: true
    }
},
{
    _id:false
});

const preprationPlaanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    focus: {
        type: String,
        required: true
    },
    tasks: [{
        type:String
    }]
});

const interviewReportSchema  = new mongoose.Schema({
    jobDescription : {
        type:String,
        required:true,
    },
    resume:{
        type:String,
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preprationPlan: [preprationPlaanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

const inerviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = inerviewReportModel;