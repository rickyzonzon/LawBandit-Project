import { writeFile } from "fs/promises";
import { createEvents, EventAttributes } from "ics";
import { AssignmentScheduleType } from "./extract_schedule";

export async function createCalendar(assignment_schedule: AssignmentScheduleType | null, path: string) {
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
    
    const { error, value } = createEvents(events);
    if (error) throw error;
    if (!value) throw new Error("ICS could not generate. No value returned.");
    
    await writeFile(path, value);
}