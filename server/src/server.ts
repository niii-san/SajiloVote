import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log(`EXPRESS ERROR: ${error}`);
        });
        app.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Error starting server`, err);
    });
