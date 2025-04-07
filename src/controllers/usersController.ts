import {Request, Response} from "express";
import logger from "../utils/logger";

export const getUsers = (req:Request,res:Response)=>{
    logger.info({message:"Obteniendo usuarios", action:"getUser"});
    res.json({users:["Alice","Bob","Karla"]});
};