import chalk from "chalk";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/sign-in", () => {});

app.post("/sign-up", () => {});

app.get("/home", () => {});

app.post("/new-entry", () => {});

app.post("/new-exit", () => {});

app.listen(5000, () => {
    console.log(chalk.bold.cyan("[Listening ON] Port: 5000."));
});
