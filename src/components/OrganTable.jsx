import React, { useEffect, useState } from 'react';
import './OrganTable.css'; // Import your styles here

const OrganTable = ({ organType, bloodGroup }) => {
  const [donors, setDonors] = useState([]);
  const [poppedRow, setPoppedRow] = useState(null); // To handle per-row pop animation

  useEffect(() => {
    fetch('http://localhost:5000/donors')
      .then((response) => response.json())
      .then((data) => {
        setDonors(data);
      })
      .catch((error) => {
        console.error('Error fetching donors:', error);
      });
  }, []);

  const filteredDonors = donors.filter((donor) => {
    const organMatch = organType ? donor.organ.toLowerCase() === organType.toLowerCase() : true;
    const bloodMatch = bloodGroup ? donor.bloodType.toUpperCase() === bloodGroup.toUpperCase() : true;
    return organMatch && bloodMatch;
  });

  const handleMatchRequest = (index) => {
    setPoppedRow(index); // Trigger pop effect on clicked row
    setTimeout(() => setPoppedRow(null), 100); // Remove pop after animation time
    alert(`Match request sent for donor: ${filteredDonors[index].name}`);
  };

  return (
    <>
      <div className="section-header">
        <h2>Available Donations</h2>
      </div>
      <div className="table-container">
      <div class="table-container"><table><thead><tr><th>Name</th><th>Organ</th><th>Donor Location</th><th>Availability</th><th>Compatibility (%)</th><th>Action</th></tr></thead><tbody><tr><td>Riya Sharma</td><td>Kidney</td><td>Chennai</td><td>High</td><td>89%</td><td><button class="pop-btn">Match Request</button></td></tr><tr><td>John Doe</td><td>Kidney</td><td>Chennai</td><td>high</td><td>87%</td><td><button class="pop-btn">Match Request</button></td></tr><tr><td>Lakshmi</td><td>Kidney</td><td>Chennai</td><td>High</td><td>91%</td><td><button class="pop-btn">Match Request</button></td></tr><tr><td>Arjun Mehta</td><td>Liver</td><td>Mumbai</td><td>Medium</td><td>86%</td><td><button class="pop-btn">Match Request</button></td></tr><tr><td>Sneha Reddy</td><td>Heart</td><td>Hyderabad</td><td>High</td><td>85%</td><td><button class="pop-btn">Match Request</button></td></tr><tr><td>Ravi Sharma</td><td>Lungs</td><td>Delhi</td><td>Low</td><td>93%</td><td><button class="pop-btn">Match Request</button></td></tr></tbody></table></div>
      </div>
    </>
  );
};

export default OrganTable;