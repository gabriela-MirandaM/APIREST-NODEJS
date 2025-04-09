import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  getBadRequest,
  getForbidden,
  getConflict,
  getInternalServerError,
  getNotFound,
  getUnauthorized
} from "../helpers/httpErrorHelper";

export const getUsers = (req: Request, res: Response) => {
  logger.info({ message: "Obteniendo usuarios", action: "getUser" });
  const test = req.query.test;

  try {
    switch (test) {
      case "notfound":
        throw getNotFound(res, "Usuario no encontrado");

        break;

      default:
        res.json({ users: ["Alice", "Bob", "Karla"] });
        break;
    }
  } catch (error) {
    logger.error({ message: "Error al obtener usuarios", error });
  }
};
