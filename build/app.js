"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// import multer from 'multer';
// import pdfParse from 'pdf-parse';
const dotenv_1 = __importDefault(require("dotenv"));
// import { extractSchedule } from './extract_schedule';
// import { createCalendar } from './calendar';
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// // Use Multer to keep pdf in memory as a buffer 
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     // 10MB max file size
//     fileSize: 10 * 1024 * 1024,
//   },
//   // Check to make sure file is a pdf
//   fileFilter: (_req, file, cb) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     }
//     else {
//       cb(new Error('File uploaded was not a PDF.'))
//     }
//   }
// });
app.use((0, cors_1.default)({
    origin: "https://law-bandit-project.vercel.app",
    methods: ["GET", "POST"]
}));
// Server health route
app.get('/health', (_req, res, next) => {
    try {
        res.json({ 'status': 'healthy' });
    }
    catch (err) {
        next(err);
    }
});
// Upload endpoint
// app.post('/upload',
//   // Takes a single file named 'syllabus'
//   upload.single('syllabus'),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Make sure a file was uploaded
//       if (!req.file) {
//         throw new Error("No file detected.");
//       }
//       // Extract text from the pdf
//       const result = await pdfParse(req.file.buffer);
//       const assignments = await extractSchedule(result.text);
//       // Create the .ics file
//       await createCalendar(assignments, 'build/assignments.ics');
//       // return res.json({
//       //   assignments,
//       //   calendarUrl: "/assignments.ics"
//       // });
//       return res.send(assignments);
//     } catch (err) {
//       next(err);
//     }
//   }
// );
// Allow user to download calendar file
app.get("/assignments.ics", (_req, res, next) => {
    const filePath = path_1.default.join(__dirname, "../assignments.ics");
    try {
        res.sendFile(filePath);
    }
    catch (err) {
        next(err);
    }
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    const message = err instanceof Error ? err.message : 'Unknown error.';
    res.status(500).json({ error: message });
});
// Start server
app.listen(port, () => {
    console.log('Express is listening at http://localhost:${port}');
});
//# sourceMappingURL=app.js.map