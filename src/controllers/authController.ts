import { Request, Response } from "express";
import logger from "../utils/logger";
import { User } from "../entity/User";
import { myDataSource } from "../app-data-source";
import { getBadRequest, getInternalServerError } from "../helpers/httpErrorHelper";
import { StatusCodes } from "http-status-codes";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshExpirationTime,
  IUserPayload
} from "../helpers/jsonWebTokenHelper";
import { RefreshToken } from "../entity/RefreshToken";
import jwt from "jsonwebtoken";
import { accessTokenSecret } from "../middlewares/jsonWebTokenAuth";
