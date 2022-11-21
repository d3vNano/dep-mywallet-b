import chalk from "chalk";

import { sessionsCollection } from "../database/collections.js";

async function endSession(req, res) {
    const { session } = res.locals;

    try {
        await sessionsCollection.deleteOne({ userId: session.userId });
        res.status(200).send("Até logo " + session.user);
    } catch (err) {
        console.log(chalk.bold.red(err));
        res.status(500).send(err.message);
    }
}

export { endSession };
