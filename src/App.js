import React, { useState, useEffect } from "react";
import "./App.css"; // Import custom styles

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", percentage: "", branch: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    fetch("http://localhost:8080/students")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched students:", data);
        setStudents(data);
      })
      .catch((err) => console.error("Error fetching students:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId === null) {
      fetch("http://localhost:8080/student/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          percentage: parseFloat(form.percentage),
          branch: form.branch,
        }),
      })
        .then((res) => {
          if (res.ok) {
            alert("Student added successfully!");
            setForm({ name: "", percentage: "", branch: "" });
            fetchStudents();
          } else {
            alert("Error adding student.");
          }
        })
        .catch((err) => console.error("Create error:", err));
    } else {
      fetch(`http://localhost:8080/student/update/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          percentage: parseFloat(form.percentage),
          branch: form.branch,
        }),
      })
        .then((res) => {
          if (res.ok) {
            alert("Student updated successfully!");
            setForm({ name: "", percentage: "", branch: "" });
            setEditingId(null);
            fetchStudents();
          } else {
            alert("Error updating student.");
          }
        })
        .catch((err) => console.error("Update error:", err));
    }
  };

  const deleteStudent = (id) => {
    fetch(`http://localhost:8080/student/delete/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          alert("Student deleted successfully!");
          fetchStudents();
        } else {
          alert("Error deleting student.");
        }
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const editStudent = (id) => {
    const selected = students.find((s) => s.rollNo === id);
    setForm({
      name: selected.name,
      percentage: selected.percentage,
      branch: selected.branch,
    });
    setEditingId(id);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">
        📚 <span style={{ color: "#007bff" }}>Student Management System</span>
      </h2>

      {/* Fetch Data Button */}
      {/* <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={fetchStudents}>
          🔄 Fetch Students
        </button>
      </div> */}

      {/* Student Form */}
      <div className="card shadow-lg">
        <div className="card-header">
          {editingId === null ? "Add New Student" : "Update Student"}
        </div>
        <div className="card-body text-center">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                placeholder="Student Name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                name="percentage"
                placeholder="Percentage"
                className="form-control"
                value={form.percentage}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="branch"
                placeholder="Branch"
                className="form-control"
                value={form.branch}
                onChange={handleChange}
                required
              />
            </div><br></br>
            <div className="text-center">
              <button className="btn btn-success" type="submit">
                {editingId === null ? "➕ Add Student" : "✏️ Update Student"}
              </button>
              {editingId !== null && (
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", percentage: "", branch: "" });
                  }}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Student Table */}
      <div className="table-responsive mt-4">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Percentage</th>
              <th>Branch</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.rollNo}>
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.percentage}%</td>
                <td>{s.branch}</td>
                <td className="actions">
  <button className="btn btn-warning btn-sm" onClick={() => editStudent(s.rollNo)}>
    ✏️ Edit
  </button>
  <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(s.rollNo)}>
    🗑 Delete
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
