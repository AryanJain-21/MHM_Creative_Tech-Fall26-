import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import SheetsRoutes from "./sheets/routes.js";

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(cors());

SheetsRoutes(app);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
