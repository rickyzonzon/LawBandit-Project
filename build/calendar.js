"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalendar = createCalendar;
const promises_1 = require("fs/promises");
const ics_1 = require("ics");
async function createCalendar(assignment_schedule, path) {
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
    const { error, value } = (0, ics_1.createEvents)(events);
    if (error)
        throw error;
    if (!value)
        throw new Error("ICS could not generate. No value returned.");
    await (0, promises_1.writeFile)(path, value);
}
//# sourceMappingURL=calendar.js.map