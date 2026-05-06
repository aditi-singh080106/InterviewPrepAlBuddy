const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema, jsonDescription } = require("zod-to-json-schema");


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 to 100 indicating how well the candidate's profile match with the job description."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview."),
        intention: z.string().describe("The intention of interviewer behind asking this question."),
        answere: z.string().describe("How to answere this question, what points to cover, what approach to tae etc. ")
    })).describe("Tehcnical questions that can be asked in the interview along with thier intention and how to answere them."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview."),
        intention: z.string().describe("The intention of interviewer behind asking this question."),
        answere: z.string().describe("How to answere this question, what points to cover, what approach to tae etc. ")
    })).describe("Behavioral questions that can be asked in the interview along with thier intention and how to answere them."),
    skillGaps : z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        serverity: z.enum(['low','medium','high']).describe("The severity of this skill gap, i.e how important is this skill for the job.")
    })).describe("List of skill gaps in the candidate's profile along with thier serverity"),
    preprationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the prepration plan, e.g data structure, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the prepration plan, e.g read a specific book.")
    })).describe("A day-wise prepration plan for the candidate to follow in order to prepare for the interview effectively."),
    title:z.string().describe("The tittle of the job for which the interview report is generated")
});

async function generateInterviewReport(resume, selfDescription, jobDescription){

    const prompt=`Generate an interview report for a candidate with the following details:
                    Resume: ${resume},
                    Self Description: ${selfDescription},
                    Job Description: ${jobDescription}`;



        const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "object",
            properties: {
                title: { type: "string" },
                matchScore: { type: "number" },
                technicalQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question:  { type: "string" },
                            intention: { type: "string" },
                            answere:   { type: "string" }
                        }
                    }
                },
                behavioralQuestions: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            question:  { type: "string" },
                            intention: { type: "string" },
                            answere:   { type: "string" }
                        }
                    }
                },
                skillGaps: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            skill:     { type: "string" },
                            serverity: { type: "string", enum: ["low", "medium", "high"] }
                        }
                    }
                },
                preprationPlan: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            day:   { type: "number" },
                            focus: { type: "string" },
                            tasks: { type: "array", items: { type: "string" } }
                        }
                    }
                }
            }
        }
    }
});

    // const response = await ai.models.generateContent({
    //     model:"gemini-3-flash-preview",
    //     contents:prompt,
    //     config:{
    //         responseMimeType:"application/json",
    //         responseSchema:zodToJsonSchema(interviewReportSchema)
    //     }
    // });

    console.log(JSON.parse(response.text));
    return JSON.parse(response.text);
}




/**
 * Test google api
 */
// async function invokeGeminiAi(){
//     const response = await ai.models.generateContent({
//         model:"gemini-2.5-flash",
//         contents:"Hello gemini! Explain what is Interview ?"
//     });

//     console.log("Response is : ",response.text);
// }

module.exports = { generateInterviewReport };