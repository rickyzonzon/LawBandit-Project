"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSchedule = extractSchedule;
// import { Ollama } from 'ollama';
const openai_1 = __importDefault(require("openai"));
const zod_1 = require("openai/helpers/zod");
const dotenv_1 = __importDefault(require("dotenv"));
const assignment_1 = require("./types/assignment");
async function extractSchedule(text) {
    dotenv_1.default.config();
    const client = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY
    });
    const system_prompt = `
        You are an expert at structured data extration. You will be provided a syllabus from a law school course.
        Your task is to extract the necessary information about each assignment listed in the syllabus and covert it into the given structure.
        You should tackle this problem in steps.\n
        - Step one is to identify the year that the course is taking place.\n
        - The second step is to find the section where the assignments are listed.\n
        - The third step is to extract the title of each assignment, its due date, and a description for each.\n
          - If the due date for an assignment is not in the current or the following year that the course is taking place, something went wrong and you need to try again.\n
          - If the due date for an assignment is in relative terms (e.g. "Week 1", "Day 1", etc.), then make estimations based on the days that the course is held and other contextual information.\n
        - The final step is to convert the data into the given schema.`;
    try {
        const response = await client.responses.parse({
            model: "gpt-5",
            input: [
                {
                    role: "system",
                    content: system_prompt
                },
                {
                    role: "user",
                    content: text
                }
            ],
            text: {
                format: (0, zod_1.zodTextFormat)(assignment_1.AssignmentSchedule, "assignment_schedule")
            }
        });
        return response.output_parsed;
    }
    catch (err) {
        throw err;
    }
}
// Ollama verison
// export async function extractSchedule(text: string) {
//     const ollama = new Ollama();
//     const prompt = 
//         `
//         Extract all assignments and their relevant information from the syllabus below.
//         Let's approach this task step-by-step.
//         First, identify the section where the assignment schedule is located within the syllabus.
//         Isolate this section, then extract the following details about each assignment:
//         - Title and/or assignment type (reading, writing assignment, presentation, oral assignment, etc.)
//         - Due Date (yyyy-mm-dd)
//         - Assignment description
//         Provide the details about each assigment as a JSON in the following form:
//         {
//             "assignments": [
//                 {
//                     "title": ..., 
//                     "due_date": ..., 
//                     "description": ...
//                 },
//                 ...,
//             ]
//         }
//         Syllabus text:
//         ${text}
//         `;
//         try {
//             return await ollama.generate({
//                 model: "gpt-oss:latest",
//                 prompt: prompt,
//                 format: "json"
//             });
//         } catch (err) {
//             console.error("Error extracting schedule:", err);
//         }
// }
//# sourceMappingURL=extract_schedule.js.map