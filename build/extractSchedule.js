"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSchedule = extractSchedule;
const ollama_1 = require("ollama");
async function extractSchedule(text) {
    const ollama = new ollama_1.Ollama();
    const prompt = `
        Extract all assignments and their relevant information from the syllabus below.
        Let's approach this task step-by-step.
        
        First, identify the section where the assignment schedule is located within the syllabus.
        Isolate this section, then extract the following details about each assignment:
        - Title and/or assignment type (reading, writing assignment, presentation, oral assignment, etc.)
        - Due Date (yyyy-mm-dd)
        - Assignment description
        
        Provide the details about each assigment as a JSON in the following form:
        {
            "assignments": [
                {
                    "title": ..., 
                    "due_date": ..., 
                    "description": ...
                },
                ...,
            ]
        }
        
        Syllabus text:
        ${text}
        `;
    try {
        return await ollama.generate({
            model: "gpt-oss:latest",
            prompt: prompt,
            format: "json"
        });
    }
    catch (err) {
        console.error("Error extracting schedule:", err);
    }
}
//# sourceMappingURL=extractSchedule.js.map