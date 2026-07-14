// Seed script for MongoDB using mock data
// Usage:
// 1) Start MongoDB locally (see README steps below)
// 2) Install deps: npm install mongodb
// 3) Run: node scripts/seed-mongo.js

const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'secureassess';

const MOCK = {
  users: [
    { id: 'u-faculty-1', email: 'faculty@secureassess.com', fullName: 'Dr. Robert Johnson', role: 'FACULTY', collegeId: 'c-1', departmentId: 'd-CSE' },
    { id: 'u-student-1', email: 'student@secureassess.com', fullName: 'John Doe', role: 'STUDENT', collegeId: 'c-1', departmentId: 'd-IT' },
    { id: 'u-dev-student', email: 'devstudent@secureassess.com', fullName: 'Dev Student', role: 'STUDENT', collegeId: 'c-1', departmentId: 'd-IT' }
  ],
  colleges: [
    { id: 'c-1', name: 'Apex Engineering College', code: 'AEC' }
  ],
  departments: [
    { id: 'd-CSE', name: 'CSE', collegeId: 'c-1' },
    { id: 'd-AIML', name: 'AIML', collegeId: 'c-1' },
    { id: 'd-AIDS', name: 'AIDS', collegeId: 'c-1' },
    { id: 'd-ECE', name: 'ECE', collegeId: 'c-1' },
    { id: 'd-EEE', name: 'EEE', collegeId: 'c-1' },
    { id: 'd-MECH', name: 'MECH', collegeId: 'c-1' },
    { id: 'd-CIVIL', name: 'CIVIL', collegeId: 'c-1' },
    { id: 'd-IT', name: 'IT', collegeId: 'c-1' },
    { id: 'd-BIOTECH', name: 'BIOTECH', collegeId: 'c-1' },
    { id: 'd-CHEM', name: 'CHEM', collegeId: 'c-1' }
  ],
  courses: [
    { id: 'course-1', name: 'Bachelor of Technology', departmentId: 'd-CSE' }
  ],
  subjects: [
    { id: 'subj-ds', name: 'Data Structures and Algorithms', courseId: 'course-1' }
  ],
  assessments: [],
  questions: [],
  sessions: []
};

async function seed() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log('Connected to MongoDB at', url);
    const db = client.db(dbName);

    // Drop existing collections if present
    for (const col of ['users','colleges','departments','courses','subjects','assessments','questions','sessions']) {
      try { await db.collection(col).drop(); } catch(e) { /* ignore if missing */ }
    }

    // Insert data
    if (MOCK.users && MOCK.users.length) await db.collection('users').insertMany(MOCK.users.map(u => ({...u, _id: u.id}))); 
    if (MOCK.colleges && MOCK.colleges.length) await db.collection('colleges').insertMany(MOCK.colleges.map(c => ({...c, _id: c.id}))); 
    if (MOCK.departments && MOCK.departments.length) await db.collection('departments').insertMany(MOCK.departments.map(d => ({...d, _id: d.id}))); 
    if (MOCK.courses && MOCK.courses.length) await db.collection('courses').insertMany(MOCK.courses.map(c => ({...c, _id: c.id}))); 
    if (MOCK.subjects && MOCK.subjects.length) await db.collection('subjects').insertMany(MOCK.subjects.map(s => ({...s, _id: s.id}))); 
    if (MOCK.assessments && MOCK.assessments.length) await db.collection('assessments').insertMany(MOCK.assessments.map(a => ({...a, _id: a.id}))); 
    if (MOCK.questions && MOCK.questions.length) await db.collection('questions').insertMany(MOCK.questions.map(q => ({...q, _id: q.id}))); 
    if (MOCK.sessions && MOCK.sessions.length) await db.collection('sessions').insertMany(MOCK.sessions.map(s => ({...s, _id: s.id}))); 

    console.log('Seed complete. Inserted collections: users, colleges, departments, courses, subjects');
    console.log(`Database: ${dbName} at ${url}`);
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await client.close();
  }
}

seed();
