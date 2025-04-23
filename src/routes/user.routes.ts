import { Router } from "express";
import ErrorException from "../exceptions/ErrorException";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getUsers } from "../controllers/usersController";
import { authenticateToken } from "../middlewares/jsonWebTokenAuth";

const router = Router();

router.get("/", authenticateToken, getUsers);

export default router;
