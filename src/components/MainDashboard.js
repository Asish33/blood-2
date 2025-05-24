
import React, { useState, useEffect } from 'react';
import './request.css';
import defaultHospitalLogo from './hackathon1.jpg';
// import { FaTint } from 'react-icons/fa';
  
function MainDashboard() {
  const [activeTab, setActiveTab] = useState('donors');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [hospitalLogo, setHospitalLogo] = useState(defaultHospitalLogo);
  const [hospitalName, setHospitalName] = useState('City General Hospital');
  

  const [bloodInventory] = useState([
    { type: '🩸A+', quantity: 50, status: 'Stable' },
    { type: '🩸B-', quantity: 20, status: 'Low' },
    { type: '🩸O+', quantity: 100, status: 'High' },
  ]);
  
  const [organs] = useState({
    donors: [
      { organ: 'Heart', id: 'D001', location: 'City A', status: 'Available', availability: 'Immediate' },
      { organ: 'Kidney', id: 'D002', location: 'City B', status: 'Available', availability: '2 Hours' },
      { organ: 'Liver', id: 'D003', location: 'City C', status: 'Pending', availability: 'Awaiting Confirmation' },
    ],
    recipients: [
      { organ: 'Kidney', id: 'P001', location: 'City D', status: 'Needed', availability: 'High Urgency' },
      { organ: 'Heart', id: 'P002', location: 'City E', status: 'Needed', availability: 'Medium Urgency' },
      { organ: 'Lungs', id: 'P003', location: 'City F', status: 'Needed', availability: 'Low Urgency' },
    ]
  });
  
  const [notifications] = useState([
    { id: 1, text: 'New match found for Patient X', isRead: false },
    { id: 2, text: 'Low O- blood alert', isRead: false, urgent: true },
    { id: 3, text: 'System sync complete', isRead: false, success: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (menuItem) => {
    setActiveMenu(menuItem);
    setIsMenuOpen(false);
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoUrl = reader.result;
        setHospitalLogo(logoUrl);
        localStorage.setItem('hospitalLogo', logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHospitalNameChange = (e) => {
    const newName = e.target.value;
    setHospitalName(newName);
    localStorage.setItem('hospitalName', newName);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Stable':
      case 'High':
      case 'Available':
      case 'Immediate':
        return 'status-green';
      case 'Low':
      case 'Medium Urgency':
      case '2 Hours':
        return 'status-yellow';
      case 'Pending':
      case 'Awaiting Confirmation':
      case 'Low Urgency':
        return 'status-gray';
      case 'Needed':
      case 'High Urgency':
        return 'status-red';
      default:
        return '';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderDashboard = () => (
    <main className="dashboard-main">
      <section className="dashboard-column blood-supply">
        <div className="column-header">
          <h2><i className="fas fa-tint"></i> Blood Supply Status</h2>
          <div className="last-updated">
            <i className="fas fa-clock"></i> {formatTime(lastUpdated)}
          </div>
        </div>

        {bloodInventory.map((blood, index) => (
          <div key={index} className={`blood-card ${getStatusColor(blood.status)}`}>
            <div className="blood-icon">
              <i className="fas fa-tint"></i>
            </div>
            <div className="blood-info">
              <h3>{blood.type}</h3>
              <p>{blood.quantity} units | {blood.status}</p>
            </div>
          </div>
        ))}

        <div className="blood-alert">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Critical: Low O- stock!</p>
          <button className="alert-button">Request Urgent Supply</button>
        </div>
      </section>

      <section className="dashboard-column organ-donation">
        <div className="column-header">
          <h2><i className="fas fa-heartbeat"></i> Organ Donation Status📈</h2>
          <div className="last-updated">
            <i className="fas fa-clock"></i> {formatTime(lastUpdated)}
          </div>
        </div>

        <div className="organ-tabs">
          <button 
            className={`tab-button ${activeTab === 'donors' ? 'active' : ''}`}
            onClick={() => setActiveTab('donors')}
          >
            Available Organs (Donors)
          </button>
          <button 
            className={`tab-button ${activeTab === 'recipients' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipients')}
          >
            Needed Organs (Recipients)
          </button>
        </div>

        <div className="organ-table-container">
          <table className="organ-table">
            <thead>
              <tr>
                <th>Organ</th>
                <th>ID</th>
                <th>Location</th>
                <th>Status</th>
                <th>Availability/Urgency</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {organs[activeTab].map((organ, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                  <td>{organ.organ}</td>
                  <td>{organ.id}</td>
                  <td>{organ.location}</td>
                  <td className={getStatusColor(organ.status)}>{organ.status}</td>
                  <td className={getStatusColor(organ.availability)}>{organ.availability}</td>
                  <td>
                    <button className="match-button">
                      Match Now <i className="fas fa-arrow-right"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-column notifications">
        <div className="column-header">
          <h2><i className="fas fa-bell"></i> Notifications</h2>
          <div className="last-updated">
            <i className="fas fa-clock"></i> {formatTime(lastUpdated)}
          </div>
        </div>

        <div className="notification-list">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.urgent ? 'urgent' : ''} ${notification.success ? 'success' : ''}`}
            >
              <p>{notification.text}</p>
              <span className="notification-time">{formatTime(lastUpdated)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );

  const renderBloodInventory = () => (
    <div className="page-content">
      <h2>Blood Inventory Management</h2>
      <p>Detailed blood inventory management content would go here.</p>
    </div>
  );

  const renderOrganRegistry = () => (
    <div className="page-content">
      <h2>Organ Registry</h2>
      <p>Organ registry management content would go here.</p>
    </div>
  );

  const renderMatches = () => (
    <div className="page-content">
      <h2>✔️Matches</h2>
      <p>Matching system content would go here.</p>
    </div>
  );

  const renderReports = () => (
    <div className="page-content">
      <h2>Reports</h2>
      <p>Reporting system content would go here.</p>
    </div>
  );
  const renderSettings = () => (
    <div className="page-content">
      <h2>Hospital Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="hospitalName">Hospital Name</label>
          <input
            type="text"
            id="hospitalName"
            value={hospitalName}
            onChange={handleHospitalNameChange}
          />
        </div>
        
        <div className="form-group">
          <label>Hospital Logo</label>
          <div className="logo-upload-container">
            <div className="current-logo-preview">
              <img src={hospitalLogo} alt="Current Hospital Logo" className="logo-preview" />
            </div>
            <div className="upload-controls">
              <input
                type="file"
                id="logoUpload"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="logoUpload" className="upload-button">
                <i className="fas fa-upload"></i> Upload New Logo
              </label>
              <p className="upload-hint">Recommended size: 200x200px</p>
            </div>
          </div>
        </div>
        
        <button className="save-settings-button">
          <i className="fas fa-save"></i> Save Settings
        </button>
      </div>
    </div>
  );

  
  return (
    <div className="dashboard">
      {/* <header className="dashboard-header">
        <div className="header-left">
          <div class="nav-icon">
            <img src={hospitalLogo} className='logo'></img>
           </div>   
          <h1>City General Hospital</h1>
        </div>
        <button className="mobile-menu-button" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li className={activeMenu === 'dashboard' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuClick('dashboard')}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li className={activeMenu === 'blood' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuClick('blood')}>
                <i className="fas fa-tint"></i> Blood Inventory
              </a>
            </li>
            <li className={activeMenu === 'organ' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuClick('organ')}>
                <i className="fas fa-heartbeat"></i> Organ Registry
              </a>
            </li>
            <li className={activeMenu === 'matches' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuClick('matches')}>
                <i className="fas fa-handshake"></i> Matches
              </a>
            </li>
            <li className={activeMenu === 'reports' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuClick('reports')}>
                <i className="fas fa-chart-bar"></i> Requests
              </a>
            </li>
            <li className={activeMenu === 'settings' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuClick('settings')}>
                <i className="fas fa-cog"></i> Settings
              </a>
            </li>
          </ul>
        </nav>
      </header> */}

      {activeMenu === 'dashboard' && renderDashboard()}
      {activeMenu === 'blood' && renderBloodInventory()}
      {activeMenu === 'organ' && renderOrganRegistry()}
      {activeMenu === 'matches' && renderMatches()}
      {activeMenu === 'reports' && renderReports()}
      {activeMenu === 'settings' && renderSettings()}

      {/* <footer className="dashboard-footer">
        <div className="footer-content">
          <a href="#">Help</a>
          <a href="#">Contact Support</a>
          <a href="#">Logout</a>
        </div>
      </footer> */}
    </div>
  );
}

export default MainDashboard;
