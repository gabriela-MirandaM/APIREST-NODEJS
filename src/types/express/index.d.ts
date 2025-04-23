import jwt from "jsonwebtoken";

export {}; //Necesario para que typeScript me trate esta modificacion como un módulo

declare global {
  namespace Express {
    export interface Request {
      user?: string | jwt.JwtPayload | undefined;
    }
  }
}
