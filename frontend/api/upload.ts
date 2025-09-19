import { VercelRequest, VercelResponse } from '@vercel/node';
import pdfParse from 'pdf-parse';
import formidable from 'formidable';
import fs from 'fs';
import { extractSchedule } from '../frontend/src/extract_schedule';
import { createCalendar } from '../frontend/src/calendar';

// Built-in Vercel parser can't handle pdfs
export const config = {
    api: {
        bodyParser: false
    }
    
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm({ keepExtensions: true });

    form.parse(req, async (err: any, _fields: any, files: any) => {
        try {
            if (err) throw err;
            
            // Make sure a file was uploaded
            const file = files.syllabus as formidable.File;
            if (!file) {
                return res.status(400).json({ error: 'No file uploaded' }) 
            }
            
            // Extract text from the pdf
            const result = await pdfParse(fs.readFileSync(file.filepath));
            const assignments = await extractSchedule(result.text);
            
            // Create the .ics string
            const calendar = await createCalendar(assignments);

            res.setHeader('Content-Type', 'application/json');

            return res.status(200).json({
                assignments,
                calendar: calendar
            });
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({ error: err.message || 'Unknown error' });
        }
    });
}