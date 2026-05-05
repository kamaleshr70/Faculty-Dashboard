import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const SubstitutionModule = () => {
  const { isAdmin } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [substitutions, setSubstitutions] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovedLeaves();
    fetchSubstitutions();
  }, []);

  const fetchApprovedLeaves = async () => {
    const res = await axios.get('http://localhost:5000/api/leave');
    setLeaves(res.data.filter(l => l.status === 'Approved'));
  };

  const fetchSubstitutions = async () => {
    const res = await axios.get('http://localhost:5000/api/substitution');
    setSubstitutions(res.data);
  };

  const handleSuggest = async () => {
    setMessage(''); setSuggestions([]);
    if (!selectedLeave) {
      setMessage('❌ Please select a leave!'); return;
    }
    const leave = leaves.find(l => l._id === selectedLeave);
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/substitution/suggest', {
          day: leave.day,
          timeSlot: leave.timeSlot,
          absentFacultyId: leave.facultyId._id || leave.facultyId
        }
      );
      setSuggestions(res.data.suggestions);
      if (res.data.suggestions.length === 0)
        setMessage('❌ No free faculty at this slot!');
    } catch (err) {
      setMessage('❌ ' + err.response?.data?.message);
    }
    setLoading(false);
  };

  const handleAssign = async (substitute) => {
    const leave = leaves.find(l => l._id === selectedLeave);
    try {
      await axios.post('http://localhost:5000/api/substitution/assign', {
        leaveId: selectedLeave,
        absentFacultyId: leave.facultyId._id || leave.facultyId,
        substituteFacultyId: substitute.faculty._id,
        date: leave.date,
        timeSlot: leave.timeSlot,
        courseName: leave.courseName
      });
      setMessage('✅ Substitute assigned!');
      setSuggestions([]); setSelectedLeave('');
      fetchSubstitutions();
    } catch (err) {
      setMessage('❌ ' + err.response?.data?.message);
    }
  };

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h1>{substitutions.length}</h1>
          <p>Total Substitutions</p>
        </div>
        <div className="stat-card">
          <h1>{leaves.length}</h1>
          <p>Approved Leaves</p>
        </div>
      </div>

      {/* Only Admin sees Smart Finder */}
      {isAdmin && (
        <div className="card">
          <h3>🤖 Smart Substitute Finder</h3>
          <p style={{color:'#888',marginBottom:'15px',fontSize:'0.9rem'}}>
            Finds faculty FREE at that slot + lowest workload
          </p>
          <div className="form-group">
            <select value={selectedLeave}
              onChange={(e) => setSelectedLeave(e.target.value)}>
              <option value="">-- Select Approved Leave --</option>
              {leaves.map(l => (
                <option key={l._id} value={l._id}>
                  {l.facultyId?.name} | {l.day} | {l.timeSlot} | {l.courseName}
                </option>
              ))}
            </select>
            <button className="btn-primary"
              onClick={handleSuggest} disabled={loading}>
              {loading ? 'Finding...' : '🔍 Find Best Substitute'}
            </button>
            {message && <p className="error-msg">{message}</p>}
          </div>

          {suggestions.length > 0 && (
            <div style={{marginTop:'20px'}}>
              <h4 style={{marginBottom:'10px',color:'#1a1a2e'}}>
                ✅ Available Substitutes (Best match first):
              </h4>
              {suggestions.map((s, i) => (
                <div className="suggest-card" key={s.faculty._id}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <h4>#{i+1} {s.faculty.name}
                        {i === 0 && (
                          <span style={{
                            background:'#28a745',color:'white',
                            fontSize:'0.7rem',padding:'2px 8px',
                            borderRadius:'10px',marginLeft:'8px'
                          }}>BEST MATCH</span>
                        )}
                      </h4>
                      <p>Department: {s.faculty.department}</p>
                      <p>Workload: {s.totalHours} hrs/week</p>
                    </div>
                    <button className="btn-success"
                      onClick={() => handleAssign(s)}>
                      Assign ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Both see Substitution History */}
      <div className="card">
        <h3>🔄 Substitution History</h3>
        {!isAdmin && (
          <p style={{color:'#888',marginBottom:'15px',fontSize:'0.9rem'}}>
            📋 View only — Contact admin to make changes
          </p>
        )}
        <table>
          <thead>
            <tr>
              <th>#</th><th>Absent Faculty</th><th>Substitute</th>
              <th>Date</th><th>Time Slot</th><th>Course</th>
            </tr>
          </thead>
          <tbody>
            {substitutions.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center',color:'#888'}}>
                No substitutions yet
              </td></tr>
            ) : (
              substitutions.map((s, i) => (
                <tr key={s._id}>
                  <td>{i+1}</td>
                  <td>{s.absentFacultyId?.name || 'N/A'}</td>
                  <td>{s.substituteFacultyId?.name || 'N/A'}</td>
                  <td>{s.date}</td>
                  <td>{s.timeSlot}</td>
                  <td>{s.courseName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubstitutionModule;