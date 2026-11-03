import SheetsDao from "./dao.js";

export default async function SheetsRoutes(app) {
  const sheetsDao = await SheetsDao();

  const getAllForms = async (req, res) => {
    const rows = await sheetsDao.readAllForms();
    res.send(rows);
  };

  const getFormById = async (req, res) => {
    const form = await sheetsDao.getFormById(req.params.formId);
    res.send(form);
  }

  const insertForm = async (req, res) => {
    const response = await sheetsDao.insertForm(req.body);
    res.send(response);
  }
  
  app.get("/api/sheet", getAllForms);
  app.get("/api/sheet/:formId", getFormById);
  app.post("/api/sheet", insertForm);
}
