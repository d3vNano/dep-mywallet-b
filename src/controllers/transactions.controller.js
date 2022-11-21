import chalk from "chalk";
import dayjs from "dayjs";

import { transactionsCollection } from "../database/collections.js";

async function userTransactions(req, res) {
    const { session } = res.locals;

    const { type, value, description } = req.body;

    try {
        await transactionsCollection.insertOne({
            date: dayjs().format("DD/MM"),
            type,
            value,
            description,
            userId: session.userId,
        });

        res.sendStatus(201);
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
}

export { userTransactions };
