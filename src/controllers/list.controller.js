import chalk from "chalk";

import { transactionsCollection } from "../database/collections.js";

async function userList(req, res) {
    const { user } = res.locals;

    try {
        const transactions = await transactionsCollection
            .find({ userId: user._id })
            .toArray();

        res.send(transactions);
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
}

export { userList };
