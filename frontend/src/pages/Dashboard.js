import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FacultyModule from '../components/Faculty/FacultyModule';
import WorkloadModule from '../components/Workload/WorkloadModule';
import LeaveModule from '../components/Leave/LeaveModule';
import SubstitutionModule from '../components/Substitution/SubstitutionModule';

const Dashboard = () => {
  const { faculty, logout } = useAuth();
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
        <span>Welcome, <strong>{faculty?.name}</strong></span>
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
          {renderModule()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;