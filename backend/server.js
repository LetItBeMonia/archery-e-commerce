import express from "express";
// import customerRoutes from "./routes/customerRoutes";
import { createTables as createDBTables } from "./db/createTables.js";
import { createTriggers } from "./db/triggers.js";
import { testQueries } from "./db/tests.js";

const app = express();
const port = 3000;

app.use(express.json());

// app.use("/api/customer", customerRoutes);

async function startBackend() {
  try {
    // await createDBTables();
    // await createTriggers();
    // await testQueries();

    app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`),
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startBackend();

export default app;
