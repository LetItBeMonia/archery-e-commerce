import express from "express";
import { createTables as createDBTables } from "./db/createTables.js";
import { createTriggers } from "./db/triggers.js";
import { testQueries } from "./db/tests.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { pool } from "./db/dbConfig.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/customer", customerRoutes);
app.use("/api/product", productRoutes);

async function startBackend() {
  try {
    // await createDBTables();
    // await createTriggers();
    // await testQueries();

    const server = app.listen(port, () =>
      console.log(`Server is running on http://localhost:${port}`),
    );

    // Graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down server...");

      server.close(async () => {
        try {
          await pool.end();
          console.log("Database pool closed.");
          process.exit(0);
        } catch (err) {
          console.error("Error closing database pool:", err);
          process.exit(1);
        }
      });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startBackend();

export default app;
