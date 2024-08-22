import { Router } from "express";

import AuthMiddleware from "../middleware/authMiddleware";
import { getUsers } from "../controllers/acls";
import { ADMIN } from "../constants/defaultKeys";

const router = Router();

router.get("/", AuthMiddleware.authorizationHandler([ADMIN]), getUsers);

export default router;
