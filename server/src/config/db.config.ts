import { Options } from "sequelize";

export const dbConfig: Options = {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: "localhost",
    dialect: "postgres",
};
