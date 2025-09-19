"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentSchedule = void 0;
const zod_1 = require("zod");
exports.AssignmentSchedule = zod_1.z.object({
    assignments: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        due_date: zod_1.z.string().date(),
        description: zod_1.z.string()
    }))
});
//# sourceMappingURL=assignment.js.map