import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

type Assignment = {
  title: string,
  due_date: string,
  description: string
};

function App() {

  // Keep track of the file, the assignments, the upload status, and loading status
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [assignments, setAssignments] = useState<Assignment[] | null>(null);
    const [loading, setLoading] = useState(false);

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
      setMessage("");

      const formData = new FormData();
      formData.append("syllabus", file);

      try {
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (data.assignments) {
          setAssignments(data.assignments);
          setMessage("File upload success.");
        } else {
          setMessage("No assignments detected.");
        }
      } catch (err) {
        console.error(err);
        setMessage("File upload failure.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div style={{padding: "2rem"}}>

        <h1>Syllabus Upload</h1>
        <input type="file" accept="application/pdf" onChange={storeFile} />
        <button onClick={upload} disabled={loading} style={{ marginLeft: "1rem" }}>
            {loading ? "Uploading..." : "Upload syllabus"}
        </button>

        <p>{message}</p>

        {assignments && assignments.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
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
                {assignments.map((a, index) => (
                  <tr key={index}>
                    <td>{a.title}</td>
                    <td>{a.due_date}</td>
                    <td>{a.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <a href="/assignments.ics" download style={{ display: "block", marginTop: "1rem"}}>
                Download Calendar as .ics
            </a>
          </div>
        )}
      </div>
    );
  // const [count, setCount] = useState(0)

  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

export default App
