// import React, { useState } from 'react';
// import './request.css';

// function Request() {
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
//       // Remove the request from the array
//       setRequests(requests.filter(request => request.id !== id));
//     } else {
//       // For other actions (like Accept), update the status
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
//                 onChange={(e) => setQuantity(e.target.value)}
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
//                     setUrgency(['Low', 'Medium', 'High'][e.target.value])
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
//       {urgency} 
//     </div>              </div>
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
//                   className={`request-card ${request.urgency.toLowerCase()}`}
//                 >
//                   <div className="card-header">
//                     <span className="request-id">Request #{request.id}</span>
//                     <span className="blood-type">{request.bloodType}</span>
//                     <span className="quantity">{request.quantity} units</span>
//                     <span className="urgency">{request.urgency} Urgency</span>
//                   </div>
//                   <div className="card-body">
//                     <div className="location">{request.location}</div>
//                     <div className="action-buttons">
//                       <button 
//                         className="accept-button"
//                         onClick={() => handleRequestAction(request.id, 'Accepted')}
//                       >
//                         Accept
//                       </button>
//                       <button 
//                         className="reject-button"
//                         onClick={() => handleRequestAction(request.id, 'Rejected')}
//                       >
//                         Reject
//                       </button>
//                       <button className="details-button">Details</button>
//                     </div>
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
//         <p>Powered by xAI - Real-Time Matching</p>
//       </footer>
//     </div>
//   );
// }

// export default Request;
import React, { useState } from 'react';
import './request.css';

function Request() {
  // State for Send Request form
  const [bloodType, setBloodType] = useState('A+');
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState('Medium');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  
  // State for Manage Requests
  const [requests, setRequests] = useState([
    { id: 123, bloodType: 'A+', quantity: 5, urgency: 'High', location: 'City Hospital' },
    { id: 124, bloodType: 'O-', quantity: 3, urgency: 'Medium', location: 'General Hospital' }
  ]);

  // Blood type options
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Hospital options for autocomplete
  const hospitals = [
    'City Hospital', 
    'General Hospital', 
    'Central Medical', 
    'Unity Health', 
    'Regional Medical Center'
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: Math.floor(Math.random() * 1000),
        bloodType,
        quantity,
        urgency,
        location
      };
      
      setRequests([...requests, newRequest]);
      setStatus('Sent!');
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus(''), 3000);
      
      // Reset form fields
      setBloodType('A+');
      setQuantity(1);
      setUrgency('Medium');
      setLocation('');
    }, 1500);
  };

  // Handle request actions
  const handleRequestAction = (id, action) => {
    if (action === 'Rejected') {
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: 'Rejected' } : req
      ));
      // Remove the request after 2 seconds
      setTimeout(() => {
        setRequests(requests.filter(request => request.id !== id));
      }, 2000);
    } else {
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: action } : req
      ));
    }
  };

  return (
    <div className="app">

      
      <div className="dashboard-container">
        {/* Left Section - Send Request */}
        <div className="send-request-section">
          <div className="section-header">
            <h2>Send Blood Request</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="request-form">
            <div className="form-group">
              <label>1. Blood Type:</label>
              <select 
                value={bloodType} 
                onChange={(e) => setBloodType(e.target.value)}
                className="blood-type-select"
              >
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>2. Quantity (units):</label>
              <input 
                type="number" 
                min="1" 
                max="100" 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="quantity-input"
              />
            </div>
            
            <div className="form-group">
              <label>3. Urgency:</label>
              <div className="urgency-slider">
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  value={urgency === 'Low' ? 0 : urgency === 'Medium' ? 1 : 2}
                  onChange={(e) => 
                    setUrgency(['Low', 'Medium', 'High'][parseInt(e.target.value)])
                  }
                  className="slider"
                  data-urgency={urgency.toLowerCase()}
                />
                <div className="slider-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
                <div className={`urgency-indicator ${urgency.toLowerCase()}`}>
                  {urgency}
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>4. Location:</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                list="hospitals"
                className="location-input"
                placeholder="Start typing hospital name..."
              />
              <datalist id="hospitals">
                {hospitals.map(hospital => (
                  <option key={hospital} value={hospital} />
                ))}
              </datalist>
            </div>
            
            <button type="submit" className="send-button">
              Send Request
            </button>
            
            {status && (
              <div className={`status-badge ${status === 'Sent!' ? 'success' : 'sending'}`}>
                {status}
              </div>
            )}
          </form>
        </div>
        
        {/* Right Section - Manage Requests */}
        <div className="manage-requests-section">
          <div className="section-header">
            <h2>Incoming & Managed Requests</h2>
          </div>
          
          <div className="requests-list">
            {requests.length > 0 ? (
              requests.map(request => (
                <div 
                  key={request.id} 
                  className={`request-card ${request.urgency.toLowerCase()} ${request.status?.toLowerCase() || ''}`}
                >
                  <div className="card-header">
                    <span className="request-id">Request #{request.id}</span>
                    <span className="blood-type">{request.bloodType}</span>
                    <span className="quantity">{request.quantity} units</span>
                    <span className="urgency">{request.urgency} Urgency</span>
                    {request.status && (
                      <span className={`request-status ${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="location">{request.location}</div>
                    {!request.status && (
                      <div className="action-buttons">
                        <button 
                          className="accept-button"
                          onClick={() => handleRequestAction(request.id, 'Accepted')}
                        >
                          Accept
                        </button>
                        <button 
                          className="reject-button"
                          onClick={() => handleRequestAction(request.id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-requests">
                No pending requests available
              </div>
            )}
          </div>
        </div>
      </div>
      
      
    </div>
    
  );
}

export default Request;
