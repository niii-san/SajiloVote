import { Sequelize} from "sequelize";
import { dbConfig } from "../config/index.js";

const sequelize = new Sequelize(dbConfig);

export async function connectDB() {
    try {
        await sequelize.authenticate();
        Promise.resolve();
    } catch (error) {
        Promise.reject(error);
    }
}
