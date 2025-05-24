// seed.js
const mongoose = require('mongoose');
require('dotenv').config();
const IntegrationSystem = require('./models/IntegrationSystems');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await IntegrationSystem.deleteMany();
    await IntegrationSystem.insertMany([
      {
        name: 'Hospital A EMR',
        status: 'Synced',
        color: '#28A745',
        lastSync: '5 min ago',
        logs: ['Initial sync successful.']
      },
      {
        name: 'National Blood Database',
        status: 'Pending',
        color: '#ffeeba',
        lastSync: '15 min ago',
        logs: ['Waiting for sync approval.']
      },
      {
        name: 'Hospital B EHR',
        status: 'Error',
        color: '#ffebee',
        lastSync: '1 hour ago',
        logs: ['Connection timeout.']
      }
    ]);

    console.log('🌱 Seed data inserted ✅');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error inserting seed data:', err.message);
    process.exit(1);
  }
}

seedData();