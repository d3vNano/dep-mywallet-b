import chalk from "chalk";
import express from "express";
import cors from "cors";

import db from "./db/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const usersCollection = db.collection("users");
const sessionsCollection = db.collection("sessions");

app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.sendStatus(400);
        return;
    }

    try {
        const user = await usersCollection.findOne({ email });
        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            res.sendStatus(401);
            return;
        }

        const token = uuidv4();
        sessionsCollection.insertOne({
            token,
            userId: user._id,
        });
        res.send(token);
        return;
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
});

app.post("/sign-up", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.sendStatus(400);
        return;
    }

    const hashPass = bcrypt.hashSync(password, 10);

    try {
        const userExists = await usersCollection.findOne({ email });

        if (userExists) {
            res.sendStatus(409);
            return;
        }

        await usersCollection.insertOne({
            name,
            email,
            password: hashPass,
        });

        res.status(201).send("Usuário criado com sucesso!");
        return;
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
        return;
    }
});

app.get("/home", async (req, res) => {});

app.post("/new-entry", async (req, res) => {});

app.post("/new-exit", async (req, res) => {});

app.listen(5000, () => {
    console.log(chalk.bold.cyan("[Listening ON] Port: 5000."));
});
