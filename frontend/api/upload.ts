import { VercelRequest, VercelResponse } from '@vercel/node';
import pdfParse from 'pdf-parse';
import formidable from 'formidable';
import fs from 'fs';
import { extractSchedule } from '../src/extract_schedule.js';
import { createCalendar } from '../src/calendar.js';

// Built-in Vercel parser can't handle pdfs
export const config = {
    api: {
        bodyParser: false
    }   
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const form = formidable({ uploadDir: './public', keepExtensions: true });

    try {
        const file = await new Promise((resolve, reject) => {
            form.parse(req, (err, file) => {
                if (err) return reject(err);
                resolve(file);
            });
        });
        
        console.log(file);

        res.status(200).json({ message: 'File uploaded. '});

        //Extract text from the pdf
        const result = await pdfParse(fs.readFileSync(file.filepath));
        const assignments = await extractSchedule(result.text);
        
        // Create the .ics string
        const calendar = await createCalendar(assignments);

        res.setHeader('Content-Type', 'application/json');

        return res.status(200).json({
            assignments,
            calendar: calendar
        });
    } catch (err) {
        res.status(500).json({ error: `Failed to upload file. ${err}`});
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // form.parse(req, async (err: any, _fields: any, files: any) => {
    //     try {
    //         if (err) throw err;
            
    //         // Make sure a file was uploaded
    //         const file = files.syllabus as formidable.File;
    //         if (!file) {
    //             return res.status(400).json({ error: 'No file uploaded' }) 
    //         }

    //         // Extract text from the pdf
    //         const result = await pdfParse(fs.readFileSync(file.filepath));
    //         const assignments = await extractSchedule(result.text);
            
    //         // Create the .ics string
    //         const calendar = await createCalendar(assignments);

    //         res.setHeader('Content-Type', 'application/json');

    //         return res.status(200).json({
    //             assignments,
    //             calendar: calendar
    //         });
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     } catch (err: any) {
    //         console.error(err);
    //         return res.status(500).json({ error: err.message || 'Unknown error' });
    //     }
    // }); 
}