import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import accountRoutes from "./routes/accountRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", accountRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`REST API server running on http://localhost:${PORT}`);
});
