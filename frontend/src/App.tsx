import { useState } from 'react'
import './App.css'

type Assignment = {
  title: string,
  due_date: string,
  description: string
};

function App() {

  // Keep track of the file, the assignments, the upload status, and loading status
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<string | null>(null);

  // Store selected pdf
  const storeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
    }
  };

  // Store assignments
  const upload = async () => {
    if (!file) return;

    setLoading(true);
    setMessage('');
    setAssignments(null);
    setCalendar(null);

    const formData = new FormData();
    formData.append('syllabus', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();

      if (data.assignments) {
        setAssignments(data.assignments);
        setCalendar(data.calendar)
        setMessage('File upload success.');
      } else {
        setMessage('No assignments detected.');
      }
    } catch (err) {
      console.error(err);
      setMessage('File upload failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{padding: '2rem'}}>

      <h1>Syllabus Upload</h1>
      <input type='file' accept='application/pdf' onChange={storeFile} />
      <button onClick={upload} disabled={loading} style={{ marginLeft: '1rem' }}>
          {loading ? 'Uploading...' : 'Upload syllabus'}
      </button>

      <p>{message}</p>

      {assignments && assignments.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Assignments</h2>
          <table border={1} cellPadding={5}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((value, index) => (
                <tr key={index}>
                  <td>{value.title}</td>
                  <td>{value.due_date}</td>
                  <td>{value.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {calendar && (
            <a href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}`} 
                download='assignments.ics'
                style={{ display: 'block', marginTop: '1rem'}}>
                Download Calendar as .ics
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default App
