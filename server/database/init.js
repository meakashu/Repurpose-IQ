import { initDatabase, seedDatabase } from './db.js';

// Initialize and seed database
initDatabase();
seedDatabase();

console.log('✅ Database initialized and seeded successfully!');
process.exit(0);

