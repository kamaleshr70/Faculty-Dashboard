import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyModule = () => {
  const [faculties, setFaculties] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all faculty on load
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/faculty');
      setFaculties(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async () => {
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/faculty/register', {
        name, email, password, department, subject
      });
      setMessage('✅ ' + res.data.message);
      setName(''); setEmail(''); setPassword('');
      setDepartment(''); setSubject('');
      fetchFaculties();
    } catch (err) {
      setMessage('❌ ' + err.response?.data?.message);
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h1>{faculties.length}</h1>
          <p>Total Faculty</p>
        </div>
      </div>

      {/* Add Faculty Form */}
      <div className="card">
        <h3>➕ Add New Faculty</h3>
        <div className="form-group">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            placeholder="Department (e.g. CSE)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <input
            placeholder="Subject (e.g. Mathematics)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <button className="btn-primary" onClick={handleRegister}>
            Add Faculty
          </button>
          {message && <p className="error-msg">{message}</p>}
        </div>
      </div>

      {/* Faculty Table */}
      <div className="card">
        <h3>👨‍🏫 All Faculty</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            {faculties.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign:'center', color:'#888'}}>
                No faculty added yet
              </td></tr>
            ) : (
              faculties.map((f, i) => (
                <tr key={f._id}>
                  <td>{i + 1}</td>
                  <td>{f.name}</td>
                  <td>{f.email}</td>
                  <td>{f.department}</td>
                  <td>{f.subject}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyModule;