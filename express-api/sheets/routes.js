import SheetsDao from "./dao.js";

export default async function SheetsRoutes(app) {
  const sheetsDao = await SheetsDao();

  const readAllForms = async (req, res) => {
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

  const deleteForm = async (req, res) => {
    const response = await sheetsDao.deleteForm(req.params.formId);
    res.send(response);
  }
  
  const updateForm = async(req, res) => {
    const response = await sheetsDao.updateForm(req.body);
    res.send(response);
  }

  app.get("/api/sheet", readAllForms);
  app.get("/api/sheet/:formId", getFormById);
  app.post("/api/sheet", insertForm);
  app.delete("/api/sheet/:formId", deleteForm);
  app.put("/api/sheet", updateForm)
}
