const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'secureassess';

async function main() {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    const assessments = await db.collection('assessments').find({}).toArray();
    const sessions = await db.collection('sessions').find({}).toArray();
    
    console.log("=== MongoDB ASSESSMENTS ===");
    console.log("Total assessments count:", assessments.length);
    const groups = {};
    assessments.forEach(a => {
      groups[a.title] = (groups[a.title] || 0) + 1;
    });
    console.log("Assessments by title:", groups);
    
    console.log("\n=== MongoDB SESSIONS ===");
    console.log("Total sessions count:", sessions.length);
    const sessGroups = {};
    sessions.forEach(s => {
      const key = `${s.studentId} -> ${s.assessmentId}`;
      sessGroups[key] = (sessGroups[key] || 0) + 1;
    });
    console.log("Sessions by student & assessment:", sessGroups);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
