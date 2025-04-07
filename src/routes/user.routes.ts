import { Router } from "express";
import ErrorException from "../exceptions/ErrorException";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getUsers } from "../controllers/usersController";

const router=Router();

router.get("/",getUsers);

export default router;

