import { Sequelize, importModels } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: "localhost",
    dialect: PostgresDialect,
    models: await importModels(
        resolve(__dirname + "/../models/**/*.model.{ts,js}"),
    ),
});

export async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");

        if (process.env.RUNTIME === "dev") {
            console.log("Development mode: Syncing tables with alter.");
            await sequelize.sync({ alter: true,force:true });
        } else {
            await sequelize.sync();
        }

        return Promise.resolve();
    } catch (error) {
        console.error("Database connection failed:", error);
        return Promise.reject(error);
    }
}
