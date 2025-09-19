import { createEvents, type EventAttributes } from "ics";
import type { AssignmentScheduleType } from "./types/assignment";

export async function createCalendar(assignment_schedule: AssignmentScheduleType | null) {
    if (!assignment_schedule) throw new Error("No assignments found.");

    const assignments = assignment_schedule.assignments;

    const events: EventAttributes[] = assignments.map(a => {
        const date = new Date(a.due_date);
        return {
            title: a.title,
            description: a.description,
            start: [date.getFullYear(), date.getMonth() + 1, date.getDate() + 1],
            end: [date.getFullYear(), date.getMonth() + 1, date.getDate() + 1]
        };
    });
    
    const promise = new Promise((resolve, reject) => {
        const { error, value } = createEvents(events);

        if (error) return reject(error);
        if (!value) return reject(new Error("ICS could not generate."));

        resolve(value);
    });

    return promise;
}