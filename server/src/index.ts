import dotenv from "dotenv";
import { hello } from "./app.js";
import { test } from "@controllers/index.js";
dotenv.config();
console.log(process.env.PORT);
console.log(hello);

console.log(test());
