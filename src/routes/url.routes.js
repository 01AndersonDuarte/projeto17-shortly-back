import { Router } from "express";

import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { searchUrlId, searchUrlShort } from "../middlewares/url.middleware.js";
import { urlValidate } from "../schemas/urlValidate.schema.js";
import { addUrl, getUrlId, openUrl, deleteUrl } from "../controllers/url.controller.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", schemaValidation(urlValidate), authValidation, addUrl);
urlRouter.get("/urls/:id", searchUrlId, getUrlId);
urlRouter.get("/urls/open/:shortUrl", searchUrlShort, openUrl);
urlRouter.delete("/urls/:id", authValidation, searchUrlId, deleteUrl)

export default urlRouter;