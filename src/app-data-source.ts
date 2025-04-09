import { join } from "path";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const myDataSource: DataSource = new DataSource({
  type: "mariadb",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "nodejs2025",
  synchronize: false,
  logging: false,
  entities: [join(__dirname, "entity", "**/*.{ts,js}")],
  migrations: [join(__dirname, "migration", "**/*.{ts,js}")],
  subscribers: [join(__dirname, "subscriber", "**/*.{ts,js}")],
  extra: {
    connectionLimit: 10, //Número maximo de conexiones en el pool.
    connectionTimeoutMillis: 5000, //Tiempo de espera (en milisegundos) para obtener una conexion del pool antes de lanzar un error.
    acquireTimeout: 10000, //Tiempo de epera de hasta 10s antes de fallar al obtener la conexion
    idleTimeout: 30000, //Tiempo para cerrar las conexiones inactivas
    charset: "utf8_general_ci"
  }
});
