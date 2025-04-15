import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

function startServer() {
    app.listen(PORT, () => {
        console.log(`SERVER RUNNING ON PORT ${PORT}`);
    });
}

startServer();
