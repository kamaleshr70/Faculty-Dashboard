import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TIME_SLOTS = [
  '8:00-9:00', '9:00-10:00', '10:00-11:00',
  '11:00-12:00', '12:00-1:00', '2:00-3:00',
  '3:00-4:00', '4:00-5:00'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const WorkloadModule = () => {
  const [faculties, setFaculties] = useState([]);
  const [workloads, setWorkloads] = useState([]);
  const [facultyId, setFacultyId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [day, setDay] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFaculties();
    fetchWorkloads();
  }, []);

  const fetchFaculties = async () => {
    const res = await axios.get('http://localhost:5000/api/faculty');
    setFaculties(res.data);
  };

  const fetchWorkloads = async () => {
    const res = await axios.get('http://localhost:5000/api/workload');
    setWorkloads(res.data);
  };

  const handleAdd = async () => {
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/workload', {
        facultyId, courseName, day, timeSlot,
        hoursPerWeek: Number(hoursPerWeek)
      });
      setMessage('✅ Workload added successfully!');
      setCourseName(''); setDay('');
      setTimeSlot(''); setHoursPerWeek(''); setFacultyId('');
      fetchWorkloads();
    } catch (err) {
      setMessage('❌ ' + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/workload/${id}`);
    fetchWorkloads();
  };

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h1>{workloads.length}</h1>
          <p>Total Assignments</p>
        </div>
        <div className="stat-card">
          <h1>{faculties.length}</h1>
          <p>Faculty Count</p>
        </div>
      </div>

      {/* Add Workload Form */}
      <div className="card">
        <h3>➕ Assign Workload</h3>
        <div className="form-group">
          <select value={facultyId} onChange={(e) => setFacultyId(e.target.value)}>
            <option value="">-- Select Faculty --</option>
            {faculties.map(f => (
              <option key={f._id} value={f._id}>{f.name} ({f.department})</option>
            ))}
          </select>
          <input
            placeholder="Course Name (e.g. Data Structures)"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">-- Select Day --</option>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
            <option value="">-- Select Time Slot --</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            placeholder="Hours Per Week (e.g. 3)"
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
          />
          <button className="btn-primary" onClick={handleAdd}>
            Assign Workload
          </button>
          {message && <p className="error-msg">{message}</p>}
        </div>
      </div>

      {/* Workload Table */}
      <div className="card">
        <h3>📚 All Workload Assignments</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Faculty</th>
              <th>Course</th>
              <th>Day</th>
              <th>Time Slot</th>
              <th>Hrs/Week</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {workloads.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center', color:'#888'}}>
                No workloads assigned yet
              </td></tr>
            ) : (
              workloads.map((w, i) => (
                <tr key={w._id}>
                  <td>{i + 1}</td>
                  <td>{w.facultyId?.name || 'N/A'}</td>
                  <td>{w.courseName}</td>
                  <td>{w.day}</td>
                  <td>{w.timeSlot}</td>
                  <td>{w.hoursPerWeek}</td>
                  <td>
                    <button className="btn-danger"
                      onClick={() => handleDelete(w._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkloadModule;