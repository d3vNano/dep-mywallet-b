import chalk from "chalk";
import express from "express";
import cors from "cors";

import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import {
    usersCollection,
    sessionsCollection,
    entriesCollection,
    exitiesCollection,
} from "./database/collections.js";

const app = express();
app.use(cors());
app.use(express.json());

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
            user: user.name,
            token,
            userId: user._id,
        });
        res.send("token: " + token);
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

app.get("/home", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const session = await sessionsCollection.findOne({ token });

        if (!session) {
            res.sendStatus(401);
            return;
        }

        const entries = await entriesCollection
            .find({ userId: session.userId })
            .toArray();
        const exities = await exitiesCollection
            .find({ userId: session.userId })
            .toArray();

        res.send({
            user: session.user,
            entries,
            exities,
        });
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
});

app.post("/new-entry", async (req, res) => {
    const { value, description } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!value || !description) {
        res.sendStatus(404);
        return;
    }

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const session = await sessionsCollection.findOne({ token });

        if (!session) {
            res.sendStatus(401);
            return;
        }

        await entriesCollection.insertOne({
            date: dayjs().format("DD/MM"),
            value,
            description,
            userId: session.userId,
        });

        res.sendStatus(201);
        return;
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
});

app.post("/new-exit", async (req, res) => {
    const { value, description } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!value || !description) {
        res.sendStatus(404);
        return;
    }

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const session = await sessionsCollection.findOne({ token });

        if (!session) {
            res.sendStatus(401);
            return;
        }

        await exitiesCollection.insertOne({
            date: dayjs().format("DD/MM"),
            value,
            description,
            userId: session.userId,
        });

        res.sendStatus(201);
        return;
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
});

app.delete("/sessions", async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const session = await sessionsCollection.findOne({ token });

        if (!session) {
            res.sendStatus(401);
            return;
        }

        await sessionsCollection.deleteOne({ userId: session.userId });
        res.status(200).send("Até logo " + session.user);
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
});

app.listen(5000, () => {
    console.log(chalk.bold.cyan("[Listening ON] Port: 5000."));
});
