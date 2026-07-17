// Seed script: run with `node seed.js` to WIPE and repopulate demo data.
// (For non-destructive auto-seeding on an empty DB, see utils/seedData.js
//  which server.js also calls automatically on startup.)
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { seedDatabase } from "./utils/seedData.js";

dotenv.config();
await connectDB();

seedDatabase({ force: true })
  .then(() => {
    console.log("✅ Seed data created successfully");
    console.log("Admin login: admin@rentride.com / admin123");
    console.log("Customer login: customer@rentride.com / customer123");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
