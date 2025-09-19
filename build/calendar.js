"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalendar = createCalendar;
const ics_1 = require("ics");
async function createCalendar(assignment_schedule) {
    if (!assignment_schedule)
        throw new Error("No assignments found.");
    const assignments = assignment_schedule.assignments;
    const events = assignments.map(a => {
        const date = new Date(a.due_date);
        return {
            title: a.title,
            description: a.description,
            start: [date.getFullYear(), date.getMonth() + 1, date.getDate() + 1],
            end: [date.getFullYear(), date.getMonth() + 1, date.getDate() + 1]
        };
    });
    const promise = new Promise((resolve, reject) => {
        const { error, value } = (0, ics_1.createEvents)(events);
        if (error)
            return reject(error);
        if (!value)
            return reject(new Error("ICS could not generate."));
        resolve(value);
    });
    return promise;
}
//# sourceMappingURL=calendar.js.map