import { AssignmentSchedule } from "../extract_schedule";
import { z } from "zod";

export type AssignmentScheduleType = z.infer<typeof AssignmentSchedule>;
