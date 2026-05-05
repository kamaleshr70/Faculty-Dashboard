import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FacultyModule from '../components/Faculty/FacultyModule';
import WorkloadModule from '../components/Workload/WorkloadModule';
import LeaveModule from '../components/Leave/LeaveModule';
import SubstitutionModule from '../components/Substitution/SubstitutionModule';

const Dashboard = () => {
  const { faculty, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('faculty');

  const renderModule = () => {
    switch (activeTab) {
      case 'faculty':      return <FacultyModule />;
      case 'workload':     return <WorkloadModule />;
      case 'leave':        return <LeaveModule />;
      case 'substitution': return <SubstitutionModule />;
      default:             return <FacultyModule />;
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>🎓 Faculty Dashboard</h2>
        <span>
          Welcome, <strong>{faculty?.name}</strong>
          <span style={{
            background: isAdmin ? '#e94560' : '#28a745',
            color: 'white',
            fontSize: '0.75rem',
            padding: '2px 10px',
            borderRadius: '10px',
            marginLeft: '10px'
          }}>
            {isAdmin ? '👑 Admin' : '👨‍🏫 Faculty'}
          </span>
        </span>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Layout */}
      <div className="layout">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            className={activeTab === 'faculty' ? 'active' : ''}
            onClick={() => setActiveTab('faculty')}
          >
            👨‍🏫 Faculty
          </button>
          <button
            className={activeTab === 'workload' ? 'active' : ''}
            onClick={() => setActiveTab('workload')}
          >
            📚 Workload
          </button>
          <button
            className={activeTab === 'leave' ? 'active' : ''}
            onClick={() => setActiveTab('leave')}
          >
            📅 Leave
          </button>
          <button
            className={activeTab === 'substitution' ? 'active' : ''}
            onClick={() => setActiveTab('substitution')}
          >
            🔄 Substitution
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Role info banner */}
          {!isAdmin && (
            <div style={{
              background: '#d4edda',
              border: '1px solid #28a745',
              borderRadius: '8px',
              padding: '10px 20px',
              marginBottom: '20px',
              color: '#155724',
              fontSize: '0.9rem'
            }}>
              👁️ You are in <strong>View Mode</strong> — You can apply for leave and view all data.
            </div>
          )}
          {renderModule()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;