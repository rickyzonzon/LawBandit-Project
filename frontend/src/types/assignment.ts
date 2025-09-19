import { z } from "zod";

export const AssignmentSchedule = z.object ({
    assignments: z.array(z.object ({
        title: z.string(),
        due_date: z.string().date(),
        description: z.string()
    }))
})

export type AssignmentScheduleType = z.infer<typeof AssignmentSchedule>;