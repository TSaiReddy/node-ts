import { Router } from "express";
import { login, register } from "../controllers/user";

const router = Router();

router.post("/", login);
router.post("/", register);

export default router;
