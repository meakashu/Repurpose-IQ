import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_PATH || join(__dirname, '../../data/pharma.db');
const dbDir = join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize database schema
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'analyst',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Conversations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      agents TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )
  `);

  // Market data table
  db.exec(`
    CREATE TABLE IF NOT EXISTS market_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      molecule TEXT NOT NULL,
      region TEXT NOT NULL,
      therapy_area TEXT NOT NULL,
      indication TEXT,
      market_size_usd_mn REAL,
      cagr_percent REAL,
      top_competitors TEXT,
      generic_penetration REAL,
      patient_burden REAL,
      competition_level REAL
    )
  `);

  // Patents table
  db.exec(`
    CREATE TABLE IF NOT EXISTS patents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      molecule TEXT NOT NULL,
      patent_number TEXT,
      patent_type TEXT,
      expiry_date DATE,
      status TEXT DEFAULT 'active'
    )
  `);

  // Clinical trials table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clinical_trials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nct_id TEXT,
      indication TEXT,
      therapy_area TEXT,
      phase TEXT,
      drug_name TEXT,
      sponsor TEXT,
      patient_burden_score REAL,
      competition_density REAL,
      unmet_need REAL
    )
  `);

  // Query tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS query_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      query_text TEXT NOT NULL,
      agents_used TEXT,
      response_time_ms INTEGER,
      success BOOLEAN,
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // API usage tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_name TEXT NOT NULL,
      user_id INTEGER,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Clinical trial alerts table (for real-time monitoring)
  db.exec(`
    CREATE TABLE IF NOT EXISTS clinical_trial_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nct_id TEXT NOT NULL,
      molecule TEXT NOT NULL,
      title TEXT,
      status TEXT,
      phase TEXT,
      start_date TEXT,
      url TEXT,
      alert_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      viewed BOOLEAN DEFAULT 0,
      UNIQUE(nct_id, molecule)
    )
  `);

  // Create indexes for better performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_molecule_alerts ON clinical_trial_alerts(molecule)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_alert_time ON clinical_trial_alerts(alert_time)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_viewed_alerts ON clinical_trial_alerts(viewed)`);

  // Workflows table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      steps TEXT NOT NULL,
      schedule TEXT,
      enabled BOOLEAN DEFAULT 1,
      user_id INTEGER,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_run DATETIME,
      next_run DATETIME,
      run_count INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Query suggestions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS query_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query_text TEXT NOT NULL,
      embedding TEXT,
      category TEXT,
      usage_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sentiment analysis table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sentiment_analysis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      molecule TEXT NOT NULL,
      source TEXT NOT NULL,
      content TEXT,
      sentiment_score REAL,
      sentiment_label TEXT,
      keywords TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Contact submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database initialized');
}

// Seed default data
export function seedDatabase() {
  import('bcryptjs').then(({ default: bcrypt }) => {

    // Default users
    const users = [
      { username: 'admin', email: 'admin@pharma.ai', password: 'admin123', role: 'admin' },
      { username: 'analyst', email: 'analyst@pharma.ai', password: 'analyst123', role: 'analyst' },
      { username: 'manager', email: 'manager@pharma.ai', password: 'manager123', role: 'manager' },
      { username: 'demo', email: 'demo@pharma.ai', password: 'demo', role: 'analyst' },
    ];

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);

    users.forEach(user => {
      const hash = bcrypt.hashSync(user.password, 10);
      insertUser.run(user.username, user.email, hash, user.role);
    });

    // Seed market data
    const marketData = [
      { molecule: 'Metformin', region: 'Global', therapy_area: 'Diabetes', indication: 'Type 2 Diabetes', market_size_usd_mn: 3500, cagr_percent: 5.2, generic_penetration: 0.85, patient_burden: 0.6, competition_level: 0.3 },
      { molecule: 'Sitagliptin', region: 'Global', therapy_area: 'Diabetes', indication: 'Type 2 Diabetes', market_size_usd_mn: 2800, cagr_percent: -2.3, generic_penetration: 0.45, patient_burden: 0.5, competition_level: 0.5 },
      { molecule: 'Pembrolizumab', region: 'Global', therapy_area: 'Oncology', indication: 'Various Cancers', market_size_usd_mn: 20000, cagr_percent: 15.5, generic_penetration: 0.05, patient_burden: 0.8, competition_level: 0.7 },
      { molecule: 'Rivaroxaban', region: 'Global', therapy_area: 'Cardiovascular', indication: 'Anticoagulation', market_size_usd_mn: 4500, cagr_percent: 8.1, generic_penetration: 0.25, patient_burden: 0.7, competition_level: 0.6 },
      { molecule: 'Atorvastatin', region: 'Global', therapy_area: 'Cardiovascular', indication: 'Hyperlipidemia', market_size_usd_mn: 12000, cagr_percent: -1.5, generic_penetration: 0.95, patient_burden: 0.4, competition_level: 0.2 },
      { molecule: 'Lisinopril', region: 'Global', therapy_area: 'Cardiovascular', indication: 'Hypertension', market_size_usd_mn: 8000, cagr_percent: 3.2, generic_penetration: 0.90, patient_burden: 0.5, competition_level: 0.3 },
      { molecule: 'Amlodipine', region: 'Global', therapy_area: 'Cardiovascular', indication: 'Hypertension', market_size_usd_mn: 6500, cagr_percent: 2.8, generic_penetration: 0.88, patient_burden: 0.45, competition_level: 0.25 },
      { molecule: 'Omeprazole', region: 'Global', therapy_area: 'Gastroenterology', indication: 'GERD', market_size_usd_mn: 5500, cagr_percent: 4.5, generic_penetration: 0.92, patient_burden: 0.5, competition_level: 0.2 },
    ];

    const insertMarket = db.prepare(`
      INSERT OR IGNORE INTO market_data (molecule, region, therapy_area, indication, market_size_usd_mn, cagr_percent, generic_penetration, patient_burden, competition_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    marketData.forEach(data => {
      insertMarket.run(
        data.molecule, data.region, data.therapy_area, data.indication,
        data.market_size_usd_mn, data.cagr_percent, data.generic_penetration,
        data.patient_burden, data.competition_level
      );
    });

    // Seed patent data
    const patents = [
      { molecule: 'Sitagliptin', patent_number: 'US7128924', patent_type: 'Composition', expiry_date: '2027-04-15', status: 'active' },
      { molecule: 'Pembrolizumab', patent_number: 'US8802091', patent_type: 'Method', expiry_date: '2028-09-04', status: 'active' },
      { molecule: 'Rivaroxaban', patent_number: 'US7659253', patent_type: 'Composition', expiry_date: '2026-11-20', status: 'active' },
      { molecule: 'Metformin', patent_number: 'US4522811', patent_type: 'Method', expiry_date: '2002-06-11', status: 'expired' },
      { molecule: 'Atorvastatin', patent_number: 'US5273995', patent_type: 'Composition', expiry_date: '2011-06-28', status: 'expired' },
    ];

    const insertPatent = db.prepare(`
      INSERT OR IGNORE INTO patents (molecule, patent_number, patent_type, expiry_date, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    patents.forEach(patent => {
      insertPatent.run(patent.molecule, patent.patent_number, patent.patent_type, patent.expiry_date, patent.status);
    });

    // Seed clinical trials data
    const clinicalTrials = [
      { nct_id: 'NCT04567890', drug_name: 'Metformin', indication: 'Type 2 Diabetes', therapy_area: 'Diabetes', phase: 'Phase 4', sponsor: 'Various', patient_burden_score: 0.6, competition_density: 0.3, unmet_need: 0.4 },
      { nct_id: 'NCT04567891', drug_name: 'Metformin', indication: 'Polycystic Ovary Syndrome', therapy_area: 'Endocrinology', phase: 'Phase 3', sponsor: 'Research Institute', patient_burden_score: 0.7, competition_density: 0.2, unmet_need: 0.6 },
      { nct_id: 'NCT04567892', drug_name: 'Pembrolizumab', indication: 'Non-small Cell Lung Cancer', therapy_area: 'Oncology', phase: 'Phase 3', sponsor: 'Merck', patient_burden_score: 0.9, competition_density: 0.7, unmet_need: 0.8 },
      { nct_id: 'NCT04567893', drug_name: 'Pembrolizumab', indication: 'Melanoma', therapy_area: 'Oncology', phase: 'Phase 2', sponsor: 'Merck', patient_burden_score: 0.85, competition_density: 0.6, unmet_need: 0.75 },
      { nct_id: 'NCT04567894', drug_name: 'Sitagliptin', indication: 'Type 2 Diabetes', therapy_area: 'Diabetes', phase: 'Phase 4', sponsor: 'Merck', patient_burden_score: 0.5, competition_density: 0.5, unmet_need: 0.3 },
      { nct_id: 'NCT04567895', drug_name: 'Rivaroxaban', indication: 'Atrial Fibrillation', therapy_area: 'Cardiovascular', phase: 'Phase 4', sponsor: 'Bayer', patient_burden_score: 0.7, competition_density: 0.6, unmet_need: 0.5 },
    ];

    const insertTrial = db.prepare(`
      INSERT OR IGNORE INTO clinical_trials (nct_id, drug_name, indication, therapy_area, phase, sponsor, patient_burden_score, competition_density, unmet_need)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    clinicalTrials.forEach(trial => {
      insertTrial.run(
        trial.nct_id, trial.drug_name, trial.indication, trial.therapy_area,
        trial.phase, trial.sponsor, trial.patient_burden_score,
        trial.competition_density, trial.unmet_need
      );
    });

    console.log('✅ Database seeded with default users, market data, patents, and clinical trials');
  }).catch(err => {
    console.error('Error seeding database:', err);
  });
}

export default db;

