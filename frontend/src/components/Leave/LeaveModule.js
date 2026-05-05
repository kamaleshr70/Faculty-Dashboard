import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TIME_SLOTS = [
  '8:00-9:00','9:00-10:00','10:00-11:00',
  '11:00-12:00','12:00-1:00','2:00-3:00',
  '3:00-4:00','4:00-5:00'
];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

const LeaveModule = () => {
  const { faculty, isAdmin } = useAuth();
  const [faculties, setFaculties] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [facultyId, setFacultyId] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [courseName, setCourseName] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFaculties();
    fetchLeaves();
    // Pre-fill faculty ID if logged in as faculty
    if (!isAdmin) setFacultyId(faculty?.id);
  }, []);

  const fetchFaculties = async () => {
    const res = await axios.get('http://localhost:5000/api/faculty');
    setFaculties(res.data);
  };

  const fetchLeaves = async () => {
    const res = await axios.get('http://localhost:5000/api/leave');
    setLeaves(res.data);
  };

  const handleApply = async () => {
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/leave', {
        facultyId, date, day, timeSlot, courseName, reason
      });
      setMessage('✅ Leave applied successfully!');
      setDate(''); setDay(''); setTimeSlot('');
      setCourseName(''); setReason('');
      fetchLeaves();
    } catch (err) {
      setMessage('❌ ' + err.response?.data?.message);
    }
  };

  const handleStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/leave/${id}`, { status });
    fetchLeaves();
  };

  const pending  = leaves.filter(l => l.status === 'Pending').length;
  const approved = leaves.filter(l => l.status === 'Approved').length;
  const rejected = leaves.filter(l => l.status === 'Rejected').length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><h1>{pending}</h1><p>Pending</p></div>
        <div className="stat-card"><h1>{approved}</h1><p>Approved</p></div>
        <div className="stat-card"><h1>{rejected}</h1><p>Rejected</p></div>
      </div>

      {/* Apply Leave Form — Both Admin and Faculty can apply */}
      <div className="card">
        <h3>📝 Apply for Leave</h3>
        <div className="form-group">

          {/* Admin selects faculty | Faculty sees own name */}
          {isAdmin ? (
            <select value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}>
              <option value="">-- Select Faculty --</option>
              {faculties.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.department})
                </option>
              ))}
            </select>
          ) : (
            <input
              value={faculty?.name}
              disabled
              style={{background:'#f0f0f0', color:'#555'}}
            />
          )}

          <input type="date" value={date}
            onChange={(e) => setDate(e.target.value)} />
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">-- Select Day --</option>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}>
            <option value="">-- Select Time Slot --</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input placeholder="Course Name" value={courseName}
            onChange={(e) => setCourseName(e.target.value)} />
          <input placeholder="Reason for Leave" value={reason}
            onChange={(e) => setReason(e.target.value)} />
          <button className="btn-primary" onClick={handleApply}>
            Apply Leave
          </button>
          {message && <p className="error-msg">{message}</p>}
        </div>
      </div>

      {/* Leave Table — Both see, only Admin has approve/reject */}
      <div className="card">
        <h3>📅 All Leave Requests</h3>
        <table>
          <thead>
            <tr>
              <th>#</th><th>Faculty</th><th>Date</th>
              <th>Day</th><th>Slot</th><th>Course</th>
              <th>Reason</th><th>Status</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr><td colSpan="9" style={{textAlign:'center',color:'#888'}}>
                No leave requests yet
              </td></tr>
            ) : (
              leaves.map((l, i) => (
                <tr key={l._id}>
                  <td>{i+1}</td>
                  <td>{l.facultyId?.name || 'N/A'}</td>
                  <td>{l.date}</td>
                  <td>{l.day}</td>
                  <td>{l.timeSlot}</td>
                  <td>{l.courseName}</td>
                  <td>{l.reason}</td>
                  <td>
                    <span className={`badge badge-${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      {l.status === 'Pending' && (
                        <>
                          <button className="btn-success"
                            onClick={() => handleStatus(l._id,'Approved')}>✓</button>
                          <button className="btn-danger"
                            onClick={() => handleStatus(l._id,'Rejected')}>✗</button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveModule;