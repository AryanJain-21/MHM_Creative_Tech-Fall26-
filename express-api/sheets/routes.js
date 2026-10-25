import SheetsDao from "./dao.js";

export default async function SheetsRoutes(app) {
  const sheetsDao = await SheetsDao();

  const getAllRows = async (req, res) => {
    const rows = await sheetsDao.readAllRows();
    res.send(rows);
  };

  app.get("/api/sheet", getAllRows);
}
