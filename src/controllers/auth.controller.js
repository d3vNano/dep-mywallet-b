import chalk from "chalk";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import {
    usersCollection,
    sessionsCollection,
} from "../database/collections.js";

import { signUpSchema, signInSchema } from "../models/auth.schema.js";

async function signUp(req, res) {
    const { name, email, password } = req.body;
    const { error } = signUpSchema.validate({ name, email, password });

    if (error) {
        res.sendStatus(400);
        return;
    }

    const hashPass = bcrypt.hashSync(password, 10);

    try {
        const userExists = await usersCollection.findOne({ email });

        if (userExists) {
            res.sendStatus(401);
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
}

async function signIn(req, res) {
    const { email, password } = req.body;

    const { error } = signInSchema.validate({
        email,
        password,
    });

    if (error) {
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

        const sessionExist = await sessionsCollection.findOne({
            userId: user._id,
        });

        if (sessionExist) {
            res.sendStatus(400);
            return;
        }

        const token = uuidv4();
        sessionsCollection.insertOne({
            user: user.name,
            token,
            userId: user._id,
        });
        res.status(200).send({
            username: user.name,
            token,
        });
        return;
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
}

export { signUp, signIn };
