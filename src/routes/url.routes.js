import { Router } from "express";

import schemaValidation from "../middlewares/schemaValidation.middleware.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";
import { searchUrl } from "../middlewares/url.middleware.js";
import { urlValidate } from "../schemas/urlValidate.schema.js";
import { addUrl, getUrlId, openUrl } from "../controllers/url.controller.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", schemaValidation(urlValidate), authValidation, addUrl);
urlRouter.get("/urls/:id", searchUrl, getUrlId);
urlRouter.get("/urls/open/:shortUrl", openUrl);

export default urlRouter;