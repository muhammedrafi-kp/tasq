import express from "express";
import { configDotenv } from "dotenv";
import morgan from "morgan";

configDotenv();

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get("/api/test", (req, res) => {
    res.status(200).json({ message: "ok" });
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`server is running on a port ${process.env.PORT}`);
})