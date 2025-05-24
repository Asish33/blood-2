// backend/data.js
let systems = [
    {
      id: 1,
      hospital: "Apollo Hospital",
      type: "Blood",
      bloodGroup: "O+",
      units: 2,
      status: "Pending"
    },
    {
      id: 2,
      hospital: "Fortis",
      type: "Organ",
      organ: "Kidney",
      bloodGroup: "B-",
      status: "Pending"
    },
    {
      id: 3,
      hospital: "AIIMS Delhi",
      type: "Blood",
      bloodGroup: "A+",
      units: 4,
      status: "Approved"
    },
    {
      id: 4,
      hospital: "Care Hospitals",
      type: "Organ",
      organ: "Liver",
      bloodGroup: "AB+",
      status: "Pending"
    },
    {
      id: 5,
      hospital: "Manipal Hospitals",
      type: "Blood",
      bloodGroup: "B+",
      units: 3,
      status: "Rejected"
    },
    {
      id: 6,
      hospital: "Yashoda Hospitals",
      type: "Organ",
      organ: "Heart",
      bloodGroup: "O-",
      status: "Approved"
    },
    {
      id: 7,
      hospital: "Rainbow Children's Hospital",
      type: "Blood",
      bloodGroup: "AB-",
      units: 1,
      status: "Pending"
    },
    {
      id: 8,
      hospital: "KIMS",
      type: "Organ",
      organ: "Pancreas",
      bloodGroup: "A-",
      status: "Pending"
    },
    {
      id: 9,
      hospital: "Narayana Health",
      type: "Blood",
      bloodGroup: "O+",
      units: 5,
      status: "Approved"
    },
    {
      id: 10,
      hospital: "Max Healthcare",
      type: "Organ",
      organ: "Lung",
      bloodGroup: "B+",
      status: "Rejected"
    }
  ];
  
  
  const logs = [
    { type: 'error', message: 'Hospital B EHR - Connection timeout. Retry in 5 min.' },
    { type: 'success', message: 'National Blood Database synced successfully.' }
  ];
  
  module.exports = { systems, logs };