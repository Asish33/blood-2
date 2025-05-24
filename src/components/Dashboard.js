
import React, { useState, useEffect } from 'react';
import './dashboard.css'; 
// import hospitallogo from './components/hackathon1.jpg';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Request from './Request'
import Integration from './Integration';
import Registry from './OrganRegistry';
import MatchPage from './MatchPage';
import MainDashboard from './MainDashboard';


function App() {
  const [activeTab, setActiveTab] = useState('donors');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  const [bloodInventory] = useState([
    { type: 'A+', quantity: 50, status: 'Stable' },
    { type: 'B-', quantity: 20, status: 'Low' },
    { type: 'O+', quantity: 100, status: 'High' },
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
          <h2><i className="fas fa-heartbeat"></i> Organ Donation Status</h2>
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


  const renderMainDashBoard = () => (
    <div className="page-content">
      <h2>Dashboard
      </h2>
      <MainDashboard/>
    </div>
  );
  const renderBloodInventory = () => (
    <div className="page-content">
      {/* <h2>Requests
      </h2> */}
      <Request/>
    </div>
  );

  const renderOrganRegistry = () => (
    <div className="page-content">
      <Registry/>
    </div>
  );

  const renderMatches = () => (
    <div className="page-content">
      <MatchPage/>
    </div>
  );

  const renderReports = () => (
    <div className="page-content">
      <Integration/>
    </div>
  );

  const renderSettings = () => (
    <div className="page-content">
      <h2>Settings</h2>
      <p>System settings content would go here.</p>
    </div>
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div class="nav-icon">
            <img src=""></img>
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
                <i className="fas fa-tint"></i> Requests
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
                <i className="fas fa-chart-bar"></i> Integration
              </a>
            </li>
            <li className={activeMenu === 'settings' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuClick('settings')}>
                <i className="fas fa-cog"></i> Settings
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {activeMenu === 'dashboard' && renderDashboard()}
      {activeMenu === 'blood' && renderBloodInventory()}
      {activeMenu === 'organ' && renderOrganRegistry()}
      {activeMenu === 'matches' && renderMatches()}
      {activeMenu === 'reports' && renderReports()}
      {activeMenu === 'settings' && renderSettings()}

      <footer className="dashboard-footer">
        <div className="footer-content">
          <a href="#">Help</a>
          <a href="#">Contact Support</a>
          <a href="#">Logout</a>
          <span>Last Updated: {formatDate(lastUpdated)} at {formatTime(lastUpdated)}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

// import React, { useState } from 'react';
// import './dashboard.css';

// function App() {
//   // State for Send Request form
//   const [bloodType, setBloodType] = useState('A+');
//   const [quantity, setQuantity] = useState(1);
//   const [urgency, setUrgency] = useState('Medium');
//   const [location, setLocation] = useState('');
//   const [status, setStatus] = useState('');
  
//   // State for Manage Requests
//   const [requests, setRequests] = useState([
//     { id: 123, bloodType: 'A+', quantity: 5, urgency: 'High', location: 'City Hospital' },
//     { id: 124, bloodType: 'O-', quantity: 3, urgency: 'Medium', location: 'General Hospital' }
//   ]);

//   // Blood type options
//   const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

//   // Hospital options for autocomplete
//   const hospitals = [
//     'City Hospital', 
//     'General Hospital', 
//     'Central Medical', 
//     'Unity Health', 
//     'Regional Medical Center'
//   ];

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setStatus('Sending...');
    
//     // Simulate API call
//     setTimeout(() => {
//       const newRequest = {
//         id: Math.floor(Math.random() * 1000),
//         bloodType,
//         quantity,
//         urgency,
//         location
//       };
      
//       setRequests([...requests, newRequest]);
//       setStatus('Sent!');
      
//       // Reset status after 3 seconds
//       setTimeout(() => setStatus(''), 3000);
      
//       // Reset form fields
//       setBloodType('A+');
//       setQuantity(1);
//       setUrgency('Medium');
//       setLocation('');
//     }, 1500);
//   };

//   // Handle request actions
//   const handleRequestAction = (id, action) => {
//     if (action === 'Rejected') {
//       setRequests(requests.map(req => 
//         req.id === id ? { ...req, status: 'Rejected' } : req
//       ));
//       // Remove the request after 2 seconds
//       setTimeout(() => {
//         setRequests(requests.filter(request => request.id !== id));
//       }, 2000);
//     } else {
//       setRequests(requests.map(req => 
//         req.id === id ? { ...req, status: action } : req
//       ));
//     }
//   };

//   return (
//     <div className="app">
//       <header className="app-header">
//         <h1>BloodMatch Dashboard</h1>
//       </header>
      
//       <div className="dashboard-container">
//         {/* Left Section - Send Request */}
//         <div className="send-request-section">
//           <div className="section-header">
//             <h2>Send Blood Request</h2>
//           </div>
          
//           <form onSubmit={handleSubmit} className="request-form">
//             <div className="form-group">
//               <label>1. Blood Type:</label>
//               <select 
//                 value={bloodType} 
//                 onChange={(e) => setBloodType(e.target.value)}
//                 className="blood-type-select"
//               >
//                 {bloodTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div className="form-group">
//               <label>2. Quantity (units):</label>
//               <input 
//                 type="number" 
//                 min="1" 
//                 max="100" 
//                 value={quantity}
//                 onChange={(e) => setQuantity(parseInt(e.target.value))}
//                 className="quantity-input"
//               />
//             </div>
            
//             <div className="form-group">
//               <label>3. Urgency:</label>
//               <div className="urgency-slider">
//                 <input 
//                   type="range" 
//                   min="0" 
//                   max="2" 
//                   value={urgency === 'Low' ? 0 : urgency === 'Medium' ? 1 : 2}
//                   onChange={(e) => 
//                     setUrgency(['Low', 'Medium', 'High'][parseInt(e.target.value)])
//                   }
//                   className="slider"
//                   data-urgency={urgency.toLowerCase()}
//                 />
//                 <div className="slider-labels">
//                   <span>Low</span>
//                   <span>Medium</span>
//                   <span>High</span>
//                 </div>
//                 <div className={`urgency-indicator ${urgency.toLowerCase()}`}>
//                   {urgency}
//                 </div>
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label>4. Location:</label>
//               <input 
//                 type="text" 
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 list="hospitals"
//                 className="location-input"
//                 placeholder="Start typing hospital name..."
//               />
//               <datalist id="hospitals">
//                 {hospitals.map(hospital => (
//                   <option key={hospital} value={hospital} />
//                 ))}
//               </datalist>
//             </div>
            
//             <button type="submit" className="send-button">
//               Send Request
//             </button>
            
//             {status && (
//               <div className={`status-badge ${status === 'Sent!' ? 'success' : 'sending'}`}>
//                 {status}
//               </div>
//             )}
//           </form>
//         </div>
        
//         {/* Right Section - Manage Requests */}
//         <div className="manage-requests-section">
//           <div className="section-header">
//             <h2>Incoming & Managed Requests</h2>
//           </div>
          
//           <div className="requests-list">
//             {requests.length > 0 ? (
//               requests.map(request => (
//                 <div 
//                   key={request.id} 
//                   className={`request-card ${request.urgency.toLowerCase()} ${request.status?.toLowerCase() || ''}`}
//                 >
//                   <div className="card-header">
//                     <span className="request-id">Request #{request.id}</span>
//                     <span className="blood-type">{request.bloodType}</span>
//                     <span className="quantity">{request.quantity} units</span>
//                     <span className="urgency">{request.urgency} Urgency</span>
//                     {request.status && (
//                       <span className={`request-status ${request.status.toLowerCase()}`}>
//                         {request.status}
//                       </span>
//                     )}
//                   </div>
//                   <div className="card-body">
//                     <div className="location">{request.location}</div>
//                     {!request.status && (
//                       <div className="action-buttons">
//                         <button 
//                           className="accept-button"
//                           onClick={() => handleRequestAction(request.id, 'Accepted')}
//                         >
//                           Accept
//                         </button>
//                         <button 
//                           className="reject-button"
//                           onClick={() => handleRequestAction(request.id, 'Rejected')}
//                         >
//                           Reject
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-requests">
//                 No pending requests available
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
      
//       <footer className="app-footer">
//         <p>Blood Request</p>
//       </footer>
      
//     </div>
    
//   );
// }

// export default App;




