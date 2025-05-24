//Integration Dashboard


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [systems, setSystems] = useState([]);
//   const [filterType, setFilterType] = useState('All');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalLogs, setModalLogs] = useState([]);
//   const [modalSystem, setModalSystem] = useState(null);

//   useEffect(() => {
//     const fetchSystems = async () => {
//       try {
//         const res = await axios.get('http://localhost:5050/api/integration');
//         setSystems(res.data);
//       } catch (error) {
//         console.error('❌ Error fetching systems:', error);
//       }
//     };
//     fetchSystems();
//   }, []);

//   const handleAction = async (action, id) => {
//     if (!id) return;

//     try {
//       const endpoint =
//         action === 'Sync Now'
//           ? `http://localhost:5050/api/integration/sync/${id}`
//           : `http://localhost:5050/api/integration/retry/${id}`;

//       await axios.post(endpoint);
//       const res = await axios.get('http://localhost:5050/api/integration');
//       setSystems(res.data);
//     } catch (err) {
//       console.error(`❌ Error performing ${action}:`, err);
//     }
//   };

//   const handleDownloadSystemLogs = (system) => {
//     const text = system.logs?.join('\n') || 'No logs available';
//     const blob = new Blob([text], { type: 'text/plain' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${system.name.replace(/\s+/g, '_').toLowerCase()}-logs.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   };

//   const handleExportCSV = () => {
//     if (!systems.length) return;

//     const headers = ['System Name', 'Status', 'Last Sync'];
//     const rows = systems.map(sys => [sys.name, sys.status, sys.lastSync]);

//     let csvContent = 'data:text/csv;charset=utf-8,';
//     csvContent += headers.join(',') + '\n';
//     rows.forEach(row => {
//       csvContent += row.join(',') + '\n';
//     });

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.href = encodedUri;
//     link.download = 'integration-systems.csv';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleOpenModal = (system) => {
//     setModalSystem(system.name);
//     setModalLogs(system.logs || []);
//     setModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setModalLogs([]);
//     setModalSystem(null);
//   };

//   return (
//     <div>
//       <header style={styles.header}>
//         <h1>System Integration Hub</h1>
//         <div style={{ fontSize: '14px' }}>
//           Last Synced: {new Date().toLocaleString()}
//         </div>
//         <button style={styles.backButton}>&lt; Back to Dashboard</button>
//       </header>

//       <main style={styles.main}>
//         <h2 style={styles.heading}>Connected Systems</h2>

//         <div style={{ marginBottom: '12px' }}>
//           <button style={styles.exportCSVButton} onClick={handleExportCSV}>
//             📊 Export System Data (CSV)
//           </button>
//         </div>

//         <div style={styles.tableContainer}>
//           <table style={styles.table}>
//             <thead>
//               <tr style={styles.tableHeaderRow}>
//                 <th style={styles.cell}>System Name</th>
//                 <th style={styles.cell}>Status</th>
//                 <th style={styles.cell}>Last Sync</th>
//                 <th style={styles.cell}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {systems.map((sys) => (
//                 <tr key={sys._id || sys.name}>
//                   <td style={styles.cell}>{sys.name}</td>
//                   <td style={{ ...styles.cell, backgroundColor: sys.color || '#eee' }}>
//                     {sys.status}
//                   </td>
//                   <td style={styles.cell}>{sys.lastSync}</td>
//                   <td style={styles.cell}>
//                     {['Sync Now', 'Retry'].map((action, i) => (
//                       <button
//                         key={i}
//                         style={{
//                           ...styles.actionButton,
//                           backgroundColor: action === 'Retry' ? '#D32F2F' : '#2E7D32'
//                         }}
//                         onClick={() => handleAction(action, sys._id)}
//                       >
//                         {action}
//                       </button>
//                     ))}
//                     <button
//                       style={{ ...styles.actionButton, backgroundColor: '#0288D1' }}
//                       onClick={() => handleDownloadSystemLogs(sys)}
//                     >
//                       📄 Export Logs
//                     </button>
//                     <button
//                       style={{ ...styles.actionButton, backgroundColor: '#6A1B9A', marginTop: '6px' }}
//                       onClick={() => handleOpenModal(sys)}
//                     >
//                       🔍 View Logs
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Log Modal */}
//         {modalVisible && (
//           <div style={styles.modal}>
//             <h3 style={{ color: '#C62828' }}>Logs for {modalSystem}</h3>
//             <div style={{ marginBottom: '12px' }}>
//               <label style={{ marginRight: '8px' }}>Filter:</label>
//               <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
//                 <option value="All">All</option>
//                 <option value="Error">Error</option>
//                 <option value="Info">Info</option>
//               </select>
//             </div>
//             {modalLogs
//               .filter(log => {
//                 if (filterType === 'All') return true;
//                 const lower = log.toLowerCase();
//                 return filterType === 'Error'
//                   ? lower.includes('error') || lower.includes('timeout')
//                   : !lower.includes('error') && !lower.includes('timeout');
//               })
//               .map((log, i) => (
//                 <p
//                   key={i}
//                   style={{
//                     color: log.toLowerCase().includes('error') ? '#D32F2F' : '#2E7D32'
//                   }}
//                 >
//                   - {log}
//                 </p>
//               ))}
//             <button style={styles.closeButton} onClick={handleCloseModal}>
//               Close
//             </button>
//           </div>
//         )}
//       </main>

//       <footer style={styles.footer}>
//         IT Support | API Docs | Logout
//       </footer>
//     </div>
//   );
// }

// const styles = {
//   header: {
//     backgroundColor: '#C62828',
//     height: '80px',
//     padding: '16px',
//     color: 'white',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   backButton: {
//     backgroundColor: 'white',
//     color: '#C62828',
//     border: 'none',
//     padding: '8px 12px',
//     borderRadius: '4px',
//     cursor: 'pointer'
//   },
//   main: {
//     backgroundColor: '#ffffff',
//     padding: '16px'
//   },
//   heading: {
//     color: '#C62828'
//   },
//   exportCSVButton: {
//     backgroundColor: '#2E7D32',
//     color: 'white',
//     border: 'none',
//     padding: '8px 16px',
//     borderRadius: '4px',
//     cursor: 'pointer'
//   },
//   tableContainer: {
//     overflowY: 'auto',
//     height: '400px',
//     border: '1px solid #999999',
//     marginBottom: '20px'
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse'
//   },
//   tableHeaderRow: {
//     backgroundColor: '#f5f5f5',
//     borderBottom: '1px solid #999999'
//   },
//   cell: {
//     padding: '8px'
//   },
//   actionButton: {
//     marginRight: '8px',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     padding: '6px 10px',
//     cursor: 'pointer'
//   },
//   modal: {
//     position: 'fixed',
//     top: '10%',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     backgroundColor: 'white',
//     border: '2px solid #C62828',
//     padding: '24px',
//     zIndex: 1000,
//     width: '500px',
//     maxHeight: '70vh',
//     overflowY: 'auto',
//     boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)'
//   },
//   closeButton: {
//     marginTop: '16px',
//     backgroundColor: '#C62828',
//     color: 'white',
//     padding: '6px 12px',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer'
//   },
//   footer: {
//     backgroundColor: '#C62828',
//     color: 'white',
//     height: '60px',
//     padding: '16px',
//     textAlign: 'center',
//     fontSize: '14px'
//   }
// };

// export default App;




































//ORGAN REGISTRY

// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.css";
// import axios from "axios";

// function App() {
//   const [view, setView] = useState("home");

//   const renderContent = () => {
//     if (view === "donor") return <RegistrationDonor setView={setView} />;
//     if (view === "recipient") return <RegistrationRecipient setView={setView} />;

//     return (
//       <div className="container-fluid vh-100 d-flex">
//         {/* Donor Section */}
//         <div className="col-6 d-flex flex-column justify-content-center align-items-center bg-light border-end">
//           <h2 className="mb-4">Donor?</h2>
//           <button className="btn btn-primary" onClick={() => setView("donor")}>
//             Register as Donor
//           </button>
//         </div>

//         {/* Recipient Section */}
//         <div className="col-6 d-flex flex-column justify-content-center align-items-center bg-white">
//           <h2 className="mb-4">Recipient</h2>
//           <button className="btn btn-success" onClick={() => setView("recipient")}>
//             Register as Recipient
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return <div>{renderContent()}</div>;
// }

// function RegistrationDonor({ setView }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     location: "",
//     email: "",
//     phone: "",
//     donationType: "",
//     bloodType: "",
//     organ: "",
//     medicalHistory: "",
//     urgency: "",
//     consent1: false,
//     consent2: false,
//   });
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let updatedFormData = {
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     };

//     if (name === "donationType") {
//       updatedFormData.bloodType = "";
//       updatedFormData.organ = "";
//     }

//     setFormData(updatedFormData);
//   };

//   const validateStep = () => {
//     const newErrors = {};

//     if (step === 1) {
//       if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) {
//         newErrors.name = "Valid name is required";
//       }
//       if (!formData.age) newErrors.age = "Age is required";
//       if (!formData.gender) newErrors.gender = "Gender is required";
//       if (!formData.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
//         newErrors.email = "Valid email is required";
//       }
//       if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
//         newErrors.phone = "Phone must be 10 digits";
//       }
//     } else if (step === 2) {
//       if (!formData.donationType) newErrors.donationType = "Donation type is required";
//       if ((formData.donationType === "Blood" || formData.donationType === "Both") && !formData.bloodType) {
//         newErrors.bloodType = "Blood type is required";
//       }
//       if ((formData.donationType === "Organ" || formData.donationType === "Both") && !formData.organ) {
//         newErrors.organ = "Organ is required";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateStep()) setStep(step + 1);
//   };

//   const prevStep = () => setStep(step - 1);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post("http://localhost:5050/api/donors", formData);

//       if (response.status === 200) {
//         alert("Donor registered successfully!");
//         setView("home"); // Go back to landing page
//       } else {
//         alert("Registration failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("An error occurred while submitting the form.");
//     }
//   };

//   const isBloodEnabled = ["Blood", "Organ", "Both"].includes(formData.donationType);
//   const isOrganEnabled = ["Organ", "Both"].includes(formData.donationType);

//   return (
//     <div className="bg-white text-dark min-vh-100">
//       <header className="bg-success text-white d-flex justify-content-between align-items-center px-4" style={{ height: "80px" }}>
//         <button className="btn btn-light text-success" onClick={() => setView("home")}>
//           &lt; Back
//         </button>
//         <h1 className="h4 m-0">Donor</h1>
//         <button className="btn btn-light text-success" onClick={() => alert("Saved Draft")}>
//           Save Draft
//         </button>
//       </header>

//       <form onSubmit={handleSubmit} className="p-4">
//         <div className="progress mb-4" style={{ height: "10px" }}>
//           <div className="progress-bar bg-success" role="progressbar" style={{ width: `${step * 33.3}%` }}></div>
//         </div>

//         {/* Step 1 */}
//         {step === 1 && (
//           <div className="card p-4 mb-4">
//             <h2 className="text-success">Personal Information</h2>
//             {/* Name */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Name:</label>
//               <div className="col-sm-6">
//                 <input name="name" value={formData.name} onChange={handleChange} className="form-control" />
//                 {errors.name && <div className="text-danger">{errors.name}</div>}
//               </div>
//             </div>
//             {/* Age + Gender */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Age:</label>
//               <div className="col-sm-3">
//                 <input name="age" type="number" value={formData.age} onChange={handleChange} className="form-control" />
//                 {errors.age && <div className="text-danger">{errors.age}</div>}
//               </div>
//               <label className="col-sm-1 col-form-label">Gender:</label>
//               <div className="col-sm-2">
//                 <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
//                   <option value="">Select</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.gender && <div className="text-danger">{errors.gender}</div>}
//               </div>
//             </div>
//             {/* Email + Phone */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Email:</label>
//               <div className="col-sm-4">
//                 <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-control" />
//                 {errors.email && <div className="text-danger">{errors.email}</div>}
//               </div>
//               <label className="col-sm-1 col-form-label">Phone:</label>
//               <div className="col-sm-2">
//                 <input name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
//                 {errors.phone && <div className="text-danger">{errors.phone}</div>}
//               </div>
//             </div>
//             {/* Location */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Location:</label>
//               <div className="col-sm-10">
//                 <input name="location" value={formData.location} onChange={handleChange} className="form-control" />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 2 */}
//         {step === 2 && (
//           <div className="card p-4 mb-4">
//             <h2 className="text-primary">Medical Information</h2>
//             <div className="row mb-3">
//               <label className="col-sm-2 col-form-label">Donation Type:</label>
//               <div className="col-sm-4">
//                 <select name="donationType" value={formData.donationType} onChange={handleChange} className="form-select">
//                   <option value="">Select</option>
//                   <option value="Blood">Blood</option>
//                   <option value="Organ">Organ</option>
//                   <option value="Both">Both</option>
//                 </select>
//                 {errors.donationType && <div className="text-danger">{errors.donationType}</div>}
//               </div>
//             </div>

//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Blood Type:</label>
//               <div className="col-sm-2">
//                 <select
//                   name="bloodType"
//                   value={formData.bloodType}
//                   onChange={handleChange}
//                   className="form-select"
//                   disabled={!isBloodEnabled}
//                 >
//                   <option value="">Select</option>
//                   {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
//                     (b) => (
//                       <option key={b} value={b}>
//                         {b}
//                       </option>
//                     )
//                   )}
//                 </select>
//                 {errors.bloodType && (
//                   <div className="text-danger">{errors.bloodType}</div>
//                 )}
//               </div>
//               <label className="col-sm-1 col-form-label">Organ:</label>
//               <div className="col-sm-2">
//                 <select
//                   name="organ"
//                   value={formData.organ}
//                   onChange={handleChange}
//                   className="form-select"
//                   disabled={!isOrganEnabled}
//                 >
//                   <option value="">Select</option>
//                   <option value="Heart">Heart</option>
//                   <option value="Kidney">Kidney</option>
//                   <option value="Liver">Liver</option>
//                   <option value="Pancreas">Pancreas</option>
//                 </select>
//                 {errors.organ && (
//                   <div className="text-danger">{errors.organ}</div>
//                 )}
//               </div>
//             </div>

//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Medical History:</label>
//               <div className="col-sm-10">
//                 <textarea
//                   name="medicalHistory"
//                   value={formData.medicalHistory}
//                   onChange={handleChange}
//                   className="form-control"
//                   style={{ height: "100px" }}
//                 />
//               </div>
//             </div>

//             <div className="row mb-1 mt-1">
//               <label className="col-sm-1 col-form-label">Urgency:</label>
//               <div className="col-sm-4">
//                 <select
//                   name="urgency"
//                   value={formData.urgency}
//                   onChange={handleChange}
//                   className="form-select"
//                 >
//                   <option value="">Select</option>
//                   <option value="High">High</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Low">Low</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 3 */}
//         {step === 3 && (
//           <div className="card p-4 mb-4">
//             <h2 className="text-success">Consent & Verification</h2>
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 name="consent1"
//                 className="form-check-input"
//                 checked={formData.consent1}
//                 onChange={handleChange}
//               />
//               <label className="form-check-label">
//                 I consent to share my data with hospitals for matching.
//               </label>
//             </div>
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 name="consent2"
//                 className="form-check-input"
//                 checked={formData.consent2}
//                 onChange={handleChange}
//               />
//               <label className="form-check-label">
//                 I agree to terms and privacy policy.
//               </label>
//             </div>
//           </div>
//         )}

//         <div className="d-flex align-items-center mt-4">
//           {step > 1 && (
//             <button
//               type="button"
//               onClick={prevStep}
//               className="btn btn-secondary me-2"
//             >
//               Previous
//             </button>
//           )}
//           {step < 3 && (
//             <button
//               type="button"
//               onClick={nextStep}
//               className="btn btn-success me-2"
//             >
//               Next
//             </button>
//           )}
//           {step === 3 && (
//             <button
//               type="submit"
//               className="btn btn-success me-2"
//               onClick={handleSubmit}
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// function RegistrationRecipient({ setView }) {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     gender: "",
//     location: "",
//     email: "",
//     phone: "",
//     donationType: "",
//     bloodType: "",
//     organ: "",
//     medicalHistory : "",
//     urgency: "",
//     consent1: false,
//     consent2: false,
//     verificationCode: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [otpSent, setOtpSent] = useState(false);
//   const [serverOtp, setServerOtp] = useState("");

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     let updatedFormData = {
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     };

//     if (name === "donationType") {
//       updatedFormData.bloodType = "";
//       updatedFormData.organ = "";
//     }

//     setFormData(updatedFormData);
//   };

//   const validateStep = () => {
//     const newErrors = {};

//     if (step === 1) {
//       if (!formData.name || !/^[A-Za-z\s]+$/.test(formData.name)) {
//         newErrors.name = "Valid name is required";
//       }
//       if (!formData.age) newErrors.age = "Age is required";
//       if (!formData.gender) newErrors.gender = "Gender is required";
//       if (!formData.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
//         newErrors.email = "Valid email is required";
//       }
//       if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
//         newErrors.phone = "Phone must be 10 digits";
//       }
//     } else if (step === 2) {
//       if (!formData.donationType) newErrors.donationType = "Donation type is required";
//       if ((formData.donationType === "Blood" || formData.donationType === "Both") && !formData.bloodType) {
//         newErrors.bloodType = "Blood type is required";
//       }
//       if ((formData.donationType === "Organ" || formData.donationType === "Both") && !formData.organ) {
//         newErrors.organ = "Organ is required";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const nextStep = () => {
//     if (validateStep()) setStep(step + 1);
//   };

//   const prevStep = () => setStep(step - 1);

//   const sendOTP = async () => {
//     try {
//       const response = await axios.post("http://localhost:5050/send-otp", {
//         phone: formData.phone,
//       });

//       if (response.data.success) {
//         setOtpSent(true);
//         setServerOtp(response.data.otp); // Only for testing!
//         alert("OTP sent successfully!");
//       } else {
//         alert("Failed to send OTP. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       alert("Error sending OTP");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:5050/api/recipients", formData);
//       if (response.status === 201) {
//         alert("Recipient registered successfully!");
//         setView("home");
//       } else {
//         alert("Submission failed");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error.response ? error.response.data : error.message);
//       alert("Something went wrong while submitting the form.");
//     }
//   };

//   const isBloodEnabled = ["Blood", "Organ", "Both"].includes(formData.donationType);
//   const isOrganEnabled = ["Organ", "Both"].includes(formData.donationType);

//   return (
//     <div className="bg-white text-dark min-vh-100">
//       <header className="bg-success text-white d-flex justify-content-between align-items-center px-4" style={{ height: "80px" }}>
//         <button className="btn btn-light text-success" onClick={() => setView("home")}>
//           &lt; Back
//         </button>
//         <h1 className="h4 m-0">Recipient</h1>
//         <button className="btn btn-light text-success" onClick={() => alert("Saved Draft")}>
//           Save Draft
//         </button>
//       </header>

//       <form onSubmit={handleSubmit} className="p-4">
//         <div className="progress mb-4" style={{ height: "10px" }}>
//           <div className="progress-bar bg-success" role="progressbar" style={{ width: `${step * 33.3}%` }}></div>
//         </div>

//         {/* Step 1 */}
//         {step === 1 && (
//           <div className="card p-4 mb -4">
//             <h2 className="text-success">Personal Information</h2>
//             {/* Name */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Name:</label>
//               <div className="col-sm-6">
//                 <input name="name" value={formData.name} onChange={handleChange} className="form-control" />
//                 {errors.name && <div className="text-danger">{errors.name}</div>}
//               </div>
//             </div>
//             {/* Age + Gender */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Age:</label>
//               <div className="col-sm-3">
//                 <input name="age" type="number" value={formData.age} onChange={handleChange} className="form-control" />
//                 {errors.age && <div className="text-danger">{errors.age}</div>}
//               </div>
//               <label className="col-sm-1 col-form-label">Gender:</label>
//               <div className="col-sm-2">
//                 <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
//                   <option value="">Select</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.gender && <div className="text-danger">{errors.gender}</div>}
//               </div>
//             </div>
//             {/* Email + Phone */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Email:</label>
//               <div className="col-sm-4">
//                 <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-control" />
//                 {errors.email && <div className="text-danger">{errors.email}</div>}
//               </div>
//               <label className="col-sm-1 col-form-label">Phone:</label>
//               <div className="col-sm-2">
//                 <input name="phone" value={formData.phone} onChange={handleChange} className="form-control" />
//                 {errors.phone && <div className="text-danger">{errors.phone}</div>}
//               </div>
//             </div>
//             {/* Location */}
//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Location:</label>
//               <div className="col-sm-10">
//                 <input name="location" value={formData.location} onChange={handleChange} className="form-control" />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 2 */}
//         {step === 2 && (
//           <div className="card p-4 mb-4">
//             <h2 className="text-primary">Medical Information</h2>
//             <div className="row mb-3">
//               <label className="col-sm-2 col-form-label">Donation Type:</label>
//               <div className="col-sm-4">
//                 <select name="donationType" value={formData.donationType} onChange={handleChange} className="form-select">
//                   <option value="">Select</option>
//                   <option value="Blood">Blood</option>
//                   <option value="Organ">Organ</option>
//                   <option value="Both">Both</option>
//                 </select>
//                 {errors.donationType && <div className="text-danger">{errors.donationType}</div>}
//               </div>
//             </div>

//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Blood Type:</label>
//               <div className="col-sm-2">
//                 <select
//                   name="bloodType"
//                   value={formData.bloodType}
//                   onChange={handleChange}
//                   className="form-select"
//                   disabled={!isBloodEnabled}
//                 >
//                   <option value="">Select</option>
//                   {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
//                     (b) => (
//                       <option key={b} value={b}>
//                         {b}
//                       </option>
//                     )
//                   )}
//                 </select>
//                 {errors.bloodType && <div className="text-danger">{errors.bloodType}</div>}
//               </div>
//               <label className="col-sm-1 col-form-label">Organ:</label>
//               <div className="col-sm-2">
//                 <select
//                   name="organ"
//                   value={formData.organ}
//                   onChange={handleChange}
//  className="form-select"
//                   disabled={!isOrganEnabled}
//                 >
//                   <option value="">Select</option>
//                   <option value="Heart">Heart</option>
//                   <option value="Kidney">Kidney</option>
//                   <option value="Liver">Liver</option>
//                   <option value="Pancreas">Pancreas</option>
//                 </select>
//                 {errors.organ && <div className="text-danger">{errors.organ}</div>}
//               </div>
//             </div>

//             <div className="row mb-2">
//               <label className="col-sm-1 col-form-label">Medical History:</label>
//               <div className="col-sm-10">
//                 <textarea
//                   name="medicalHistory"
//                   value={formData.medicalHistory}
//                   onChange={handleChange}
//                   className="form-control"
//                   style={{ height: "100px" }}
//                 />
//               </div>
//             </div>

//             <div className="row mb-1 mt-1">
//               <label className="col-sm-1 col-form-label">Urgency:</label>
//               <div className="col-sm-4">
//                 <select
//                   name="urgency"
//                   value={formData.urgency}
//                   onChange={handleChange}
//                   className="form-select"
//                 >
//                   <option value="">Select</option>
//                   <option value="High">High</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Low">Low</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 3 */}
//         {step === 3 && (
//           <div className="card p-4 mb-4">
//             <h2 className="text-success">Consent & Verification</h2>
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 name="consent1"
//                 className="form-check-input"
//                 checked={formData.consent1}
//                 onChange={handleChange}
//               />
//               <label className="form-check-label">
//                 I consent to share my data with hospitals for matching.
//               </label>
//             </div>
//             <div className="form-check">
//               <input
//                 type="checkbox"
//                 name="consent2"
//                 className="form-check-input"
//                 checked={formData.consent2}
//                 onChange={handleChange}
//               />
//               <label className="form-check-label">
//                 I agree to terms and privacy policy.
//               </label>
//             </div>
//           </div>
//         )}

//         <div className="d-flex align-items-center mt-4">
//           {step > 1 && (
//             <button
//               type="button"
//               onClick={prevStep}
//               className="btn btn-secondary me-2"
//             >
//               Previous
//             </button>
//           )}
//           {step < 3 && (
//             <button
//               type="button"
//               onClick={nextStep}
//               className="btn btn-success me-2"
//             >
//               Next
//             </button>
//           )}
//           {step === 3 && (
//             <button
//               type="submit"
//               className="btn btn-success me-2"
//               onClick={handleSubmit}
//             >
//               Submit
//             </button>
//           )}
//         </div>
//       </form>
//     </div>
//   );
// }

// export default App();











//INTEGRATION DASHBOARD


// import DonorMap from './components/Donarmap';

// function App() {
//   return (
//     <div>
//       <DonorMap />
//     </div>
//   );
// }
// export default App;



//LOGIN PAGE 







// import Dashboard from './components/Dashboard'
// import React from 'react';
// // import { Routes, Route } from 'react-router-dom';


// function App() {
//   return (
//       <Dashboard/>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BloodInventory from './components/Request';
// import Registry from './OrganRegistry';
import Registry from './components/OrganRegistry';

// import MatchRequests from './components/Match';
// import RequestPage from './components/RequestPage';
import MatchPage from './components/MatchPage'
import Integration from './components/Integration';
// import LoginPage from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/blood-inventory" element={<BloodInventory />} />
         <Route path="/organ-registry" element={<Registry/>}/>
         <Route path="/match-requests" element={<MatchPage/>} />
        <Route path="/integration-hub" element={<Integration/>}/>
      </Routes>
    </Router>
  );
}

export default App;