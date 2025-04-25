import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { myDataSource } from "../app-data-source";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
import { getBadRequest, getInternalServerError } from "../helpers/httpErrorHelper";
import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshExpirationTime,
  IUserPayload
} from "../helpers/jsonWebTokenHelper";
import { generatePassword, validatePassword, verifyRefreshToken } from "../helpers/authHelper";
import { accessTokenSecret } from "../middlewares/jsonWebTokenAuth";
import { UserRegisterRequest } from "../request/userRegisterRequest";
import { userLoginRequest } from "../request/userLoginRequest";

export const register = async (req: Request, res: Response) => {
  logger.info({ message: "Registrando nuevo usuario.", action: "register" });

  const userRegisterRequest: UserRegisterRequest = req.body;
  const userRepository = myDataSource.getRepository(User);

  //Buscar el username y el correo, validar si existe
  const userFound = await userRepository.findOne({
    where: { username: userRegisterRequest.username }
  });

  const emailFound = await userRepository.findOne({
    where: { email: userRegisterRequest.email }
  });

  if (userFound || emailFound) {
    logger.error({
      message: "El usuario o correo ya ha sido registrado previamente.",
      action: "resgister"
    });
    getBadRequest(res, `El usuario o correo ya ha sido registrado previamente.`);
    return;
  }

  //Crear un nuevo usuario
  const hashedPassword = await generatePassword(userRegisterRequest.password);
  try {
    const newUser = userRepository.create({
      username: userRegisterRequest.username,
      email: userRegisterRequest.email,
      password: hashedPassword
    });

    await userRepository.save(newUser);

    //Opcional crear el token y el refreshToken o mandar mensaje que el usuario se ha registrado de manera exitosa
    logger.info({ message: `El usuario ha sido creado exitosamente.`, action: "register" });
    res.status(StatusCodes.CREATED).json({ message: `El usuario ha sido creado exitosamente.` });
  } catch (error) {
    logger.error({ message: " Ocurrio un error al crear el usuario", action: "register" });
    getInternalServerError(res, `Ocurrio un error al crear el usuario: ${error}`);
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const UserLoginRequest: userLoginRequest = req.body;
  logger.info({ message: "iniciando sesion para el usuario.", action: "login" });

  //buscar usuario por correo
  const userRepository = myDataSource.getRepository(User);
  const userFound = await userRepository.findOne({
    where: { email: UserLoginRequest.email }
  });

  //validar la password
  if (
    !userFound ||
    !(await validatePassword(UserLoginRequest.password, userFound.password as string))
  ) {
    logger.error({
      message: "Usuario o contraseña incorrecta.",
      action: "login"
    });
    getBadRequest(res, `Usuario o contraseña incorrecta.`);
    return;
  }

  //Crear el Payload para el token
  const userPayload: IUserPayload = {
    id: userFound.id as number,
    username: userFound.username as string,
    tokenVersion: userFound.tokenVersion as number
  };

  //Generar el token y el refreshToken
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  //Guardar en la base de datos el refreshToken
  const refreshTokenRepository = await myDataSource.getRepository(RefreshToken);
  try {
    //Devolver en la response el Token y el RefreshToken
    const newRefreshToken = refreshTokenRepository.create({
      refreshToken: refreshToken,
      user: userFound,
      expirationTime: getRefreshExpirationTime()
    });
    await refreshTokenRepository.save(newRefreshToken);

    logger.info({ message: "Inicio de sesión exitoso.", action: "login" });
    res.status(StatusCodes.OK).json({ accessToken, refreshToken });
  } catch (error) {
    logger.error({ message: " Ocurrio un error inesperado", action: "login", error });
    getInternalServerError(res, `Ocurrio un error inesperado: ${error}`);
    return;
  }
};
