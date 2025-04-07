import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import requestLogger from "./middlewares/requestLogger";
import appLogger from "./utils/logger";
import { request } from "http";
import { StatusCodes } from "http-status-codes";

dotenv.config();

class App{
    public app: express.Application;

    constructor(){
        this.app=express();
        this.config();
        this.routes();
        this.middlewares();
    }
    private config():void{
        this.app.use(cors());
        this.app.use(express.json());
    }
    private routes():void{
        this.app.get("/favicon.ico",function(req,res){
            res.sendStatus(StatusCodes.NO_CONTENT);
        });
        this.app.use("/api",routes);
    }
    private middlewares():void{
        this.app.use(errorHandler); //Captura de errores
        this.app.use(requestLogger); //Log de requests o historial de peticiones
    }
}

export default new App().app;
