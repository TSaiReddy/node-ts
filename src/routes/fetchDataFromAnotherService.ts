import { Router } from "express";
import { fetchDataFromAnotherService } from "../controllers/fetchDataFromAnotherService";

const router = Router();

router.get("/", fetchDataFromAnotherService);

export default router;
