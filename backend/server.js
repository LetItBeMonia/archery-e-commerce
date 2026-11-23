import express from "express";
// import customerRoutes from "./routes/customerRoutes";
import { initializeTables as initDB } from "./db/initializeTables.js";

const app = express();
const port = 3000;

app.use(express.json());

// app.use("/api/customer", customerRoutes);

async function startBackend() {
  try {
    // await initDB();

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
