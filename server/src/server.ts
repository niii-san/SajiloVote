import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`EXPRESS ERROR: ${error}`);
        });
        app.listen(PORT, () => {
            console.log(`server running on PORT: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Error starting server`, err);
    });
